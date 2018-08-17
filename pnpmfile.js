module.exports = {
    'hooks': {
        readPackage(pkg) {
            switch (pkg.name) {
                case 'gulp-less':
                    pkg.dependencies['less'] = '^3.8.0';
                    break;
                case 'html-webpack-plugin':
                case 'mini-css-extract-plugin':
                    pkg.dependencies['webpack'] = '^4.7.0';
                    pkg.dependencies['webpack-cli'] = '^3.1.0';
                    break;
                case 'web-ext':
                    pkg.dependencies['colors'] = '^1.1.2';
                    pkg.dependencies['es6-promise'] = '^4.2.4';
                    pkg.dependencies['eslint-plugin-no-unsafe-innerhtml'] = '^1.0.16';
                    pkg.dependencies['js-select'] = '^0.6.0';
                    break;
            }
            return pkg;
        }
    }
};
