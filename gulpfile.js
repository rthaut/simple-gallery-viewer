/* global require */
const gulp = require('gulp');

const pkg = require('./package.json');
const cfg = require('./gulp.config.json');

// additional native gulp packages
const fs = require('fs');
const path = require('path');

// webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

// load all plugins from package development dependencies
const $ = require('gulp-load-plugins')({
    'scope': ['devDependencies'],
    'pattern': ['*'],
    'rename': {
        'gulp-if': 'if',
        'merge-stream': 'merge',
        'rollup-stream': 'rollup',
        'webpack-stream': 'webpack',
        'vinyl-buffer': 'buffer',
        'vinyl-source-stream': 'source',
    },
    'postRequireTransforms': {
        'print': print => print.default,
        'uglify': uglify => require('gulp-uglify/composer')(require('uglify-es'), console)
    }
});



// TODO: the minify process should attempt to concatenate all of the linked components for the pages (ala useref?)
// TODO: all functions should be named to avoid <anonymous> in output - the build functions (after linting) are the problematic ones


/* ==================== HELPER FUNCTIONS ==================== */

/**
 * Get the names of all immediate folders within the supplied directory
 * @param {string} dir  the path to the directory
 * @returns {string[]} the names of immediate folders within the directory
 */
function folders(dir) {
    return fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory());
}

/**
 * Lints all JavaScript files within the supplied directory
 * @param {string} dir the path to the directory
 * @param {Boolean} [fix=true] indicates if eslint should attempt to fix errors
 * @param {Boolean} [failOnError=true] indicates if eslint should fail if there are any unfixed errors
 */
function lint(dir, fix = true, failOnError = true) {
    return $.pump([
        gulp.src(`${dir}/**/*.js`),
        $.eslint({
            'fix': fix
        }),
        $.eslint.format(),
        $.if(failOnError, $.eslint.failOnError()),
    ]);
}



/* ====================  BUILD TASKS  ==================== */

gulp.task('minify', () => {
    return $.pump([
        gulp.src(['./dist/**/*.{css,js}', '!./dist/*/vendor/**/*', '!./dist/**/*.min.*', ]),
        $.if(['**/*.css'], $.postcss()), // options are loaded from postcss.config.js automatically
        $.if(['**/*.js'], $.uglify(cfg.plugin_options.uglify)),
        // TODO: the filenames SHOULD include .min, but we would need to update the paths in both the HTML files and the manifests
        //$.rename({ 'suffix': '.min' }),
        $.header(fs.readFileSync('./src/banner.txt', 'utf8'), {
            'pkg': pkg
        }),
        gulp.dest('./dist'),
    ]);
});

// ==========================================
// build & lint tasks, broken into components
// ==========================================


gulp.task('build:images', () => {
    return $.pump([
        gulp.src([`${cfg.source_folders.images}/**/*.{png,svg}`]),
        ...Object.keys(cfg.supported_browsers).map(browser => gulp.dest(`./dist/${browser}/images`)),
    ]);
});


gulp.task('build:less', () => {
    return $.merge(Object.keys(cfg.supported_browsers).map((browser) => {
        return $.pump([
            gulp.src([`${cfg.source_folders.less}/*.less`]),
            $.less(cfg.plugin_options.less),
            $.replace(/browser-extension\:\/\//gm, cfg.supported_browsers[browser].protocol),
            gulp.dest(`./dist/${browser}/css`),
        ]);
    }));
});


/**
 * Creates multiple resized PNG versions of the SVG logo files
 */
gulp.task('build:logos', () => {
    // TODO: handle the icons/sizes defined in page_action.default_icon for Edge
    const manifest = JSON.parse(fs.readFileSync(`${cfg.source_folders.manifests}/manifest.shared.json`));
    const icons = manifest.icons;
    return $.merge(Object.keys(icons).map((size) => {
        const file = path.basename(icons[size], '.png').replace(/\-\d+/, '');
        return $.pump([
            gulp.src([`${cfg.source_folders.images}/${file}.svg`]),
            $.svg2png({
                'width': size,
                'height': size
            }),
            $.rename(icons[size]), // the name includes the relative path structure (from the manifest to the icon)
            ...Object.keys(cfg.supported_browsers).map(browser => gulp.dest(`./dist/${browser}`)),
        ]);
    }));
});


gulp.task('build:locales', () => {
    return $.merge(folders(cfg.source_folders.locales).map((folder) => {
        return $.pump([
            gulp.src([`${cfg.source_folders.locales}/${folder}/**/*.json`]),
            $.mergeJson({
                'fileName': 'messages.json'
            }),
            ...Object.keys(cfg.supported_browsers).map(browser => gulp.dest(`./dist/${browser}/_locales/${folder}`)),
        ]);
    }));
});


gulp.task('build:manifests', () => {
    return $.merge(Object.keys(cfg.supported_browsers).map((browser) => {
        return $.pump([
            gulp.src([
                `${cfg.source_folders.manifests}/manifest.shared.json`,
                `${cfg.source_folders.manifests}/manifest.${browser}.json`,
            ]),
            $.mergeJson({
                'fileName': 'manifest.json'
            }),
            $.ejs({
                'pkg': pkg
            }),
            gulp.dest(`./dist/${browser}`),
        ]);
    }));
});


gulp.task('lint:pages', () => {
    return lint(cfg.source_folders.pages, true, false);
});
gulp.task('build:pages', gulp.series('lint:pages', () => {
    // NOTE: the webpack.config.js file in the pages folder contains basic configuration that does not require any dynamic values
    const config = require(`${cfg.source_folders.pages}/webpack.config.js`);

    const entry = config.entry || {};
    const plugins = config.plugins || [];

    folders(cfg.source_folders.pages).map((folder) => {
        // define an entry point for each page (i.e. each sub-folder in the pages folder)
        entry[folder] = `${cfg.source_folders.pages}/${folder}/${folder}.js`;

        // one html-webpack-plugin instance is needed for each entry point, as the plugin does not support template strings in paths
        // (see: https://github.com/jantimon/html-webpack-plugin/issues/218#issuecomment-183066602)
        plugins.push(new HtmlWebpackPlugin({
            'template': `${cfg.source_folders.pages}/${folder}/${folder}.html`,
            'chunks': [folder],     // ensure this instance only builds when processing the corresponding page/folder entry point
            'filename': `${folder}/${folder}.html`  // equivalent to '[name]/[name].html'
        }));
    });

    return $.pump([
        $.webpack(Object.assign(config, { 'entry': entry, 'plugins': plugins })),
        ...Object.keys(cfg.supported_browsers).map(browser => gulp.dest(`./dist/${browser}/pages`)),
    ]);
}));


gulp.task('lint:scripts', () => {
    return lint(cfg.source_folders.scripts, true, false);
});
gulp.task('build:scripts', gulp.series('lint:scripts', () => {
    return $.merge(folders(cfg.source_folders.scripts).map((folder) => {
        return $.pump([
            $.rollup({
                'input': `${cfg.source_folders.scripts}/${folder}/index.js`,
                'format': 'iife',
                'name': pkg.title.replace(/\s/g, '')
            }),
            $.source(folder + '.js'),
            $.buffer(),
            ...Object.keys(cfg.supported_browsers).map(browser => gulp.dest(`./dist/${browser}/scripts`)),
        ]);
    }));
}));


gulp.task('build:vendor', () => {
    return $.pump([
        gulp.src(cfg.vendor_files),
        ...Object.keys(cfg.supported_browsers).map(browser => gulp.dest(`./dist/${browser}/vendor`)),
    ]);
});


gulp.task('build:vendor:fixes', () => {
    return $.merge(Object.keys(cfg.supported_browsers).map((browser) => {
        return $.pump([
            gulp.src([
                `./dist/${browser}/vendor/**/*`
            ]),

            // replace angular.uppercase() with String.prototype.toUpperCase() in angular-schema-form
            // (only needed until https://github.com/json-schema-form/angular-schema-form/issues/970 is fixed)
            $.if('**/schema-form.*.js', $.replace(/\w+\.uppercase\(([^\)]+)\)/gi, '$1.toUpperCase()')),

            gulp.dest(`./dist/${browser}/vendor`),
        ]);
    }));
});


// ========================
// package/distribute tasks
// ========================
gulp.task('zip', () => {
    return $.merge(Object.keys(cfg.supported_browsers).map((browser) => {
        return $.pump([
            gulp.src([`./dist/${browser}/**/*`, '!Thumbs.db']),
            $.zip(`${pkg.name}-${browser}.zip`),
            gulp.dest('./dist'),
        ]);
    }));
});


// =========================
// primary development tasks
// =========================

gulp.task('lint', gulp.parallel(
    'lint:pages',
    'lint:scripts'
));

gulp.task('build', gulp.parallel(
    'build:images',
    'build:less',
    'build:logos',
    'build:locales',
    'build:manifests',
    'build:pages',
    'build:scripts',
    gulp.series('build:vendor', 'build:vendor:fixes')
));

gulp.task('watch', (callback) => {
    $.watch(`${cfg.source_folders.less}/**/*`, gulp.series('build:less'));
    $.watch(`${cfg.source_folders.locales}/**/*`, gulp.series('build:locales'));
    $.watch(`${cfg.source_folders.manifests}/**/*`, gulp.series('build:manifests'));
    // TODO: since pages are built via webpack, it probably makes more sense to let webpack do the watch instead...
    $.watch(`${cfg.source_folders.pages}/**/*`, gulp.series('build:pages'));
    $.watch(`${cfg.source_folders.scripts }/**/*.js`, gulp.series('build:scripts'));

    callback();
});

gulp.task('package', gulp.series('build', 'minify', 'zip'));

// default task (alias build)
gulp.task('default', gulp.task('build'));
