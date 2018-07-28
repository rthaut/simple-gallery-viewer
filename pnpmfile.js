module.exports = {
    'hooks': {
        readPackage(pkg) {
            switch (pkg.name) {
                case 'web-ext':
                    pkg.dependencies['colors'] = '^1.1.2';
                    pkg.dependencies['es6-promise'] = '^4.2.4';
                    pkg.dependencies['eslint-plugin-no-unsafe-innerhtml'] = '^1.0.16'
                    pkg.dependencies['js-select'] = '^0.6.0';
                    break;
            }
            return pkg;
        }
    }
};