/* eslint-env es6, webextensions */

const Configs = (() => {

    const Configs = {

        /**
         * Returns the saved config for the specified UUID
         * @param {string} configUUID The UUID of the config to get
         * @returns {Object} The saved config
         */
        'get': function (configUUID) {
            console.log('[Background] Configs.get()', configUUID);

            return browser.storage.sync.get('Configurations').then((data) => {
                const configs = data.Configurations;
                console.log('[Background] Configs.get() :: Configurations', configs);

                if (configs !== undefined && configs !== null && configs.length) {
                    return configs.find(c => c.UUID === configUUID);
                }

                return;
            });
        },

        'getAllEnabled': function() {
            console.log('[Background] Configs.getAllEnabled()');

            return browser.storage.sync.get('Configurations').then((data) => {
                const configs = data.Configurations;

                if (configs !== undefined && configs !== null && configs.length) {
                    return configs.filter(c => c.Enabled !== false);
                }

                return [];
            });
        },

        /**
         * Removes the saved config for the specified UUID
         * @param {string} configUUID The UUID of the config to remove
         * @returns {Promise}
         */
        'remove': function (configUUID) {
            console.log('[Background] Configs.remove()', configUUID);

            return browser.storage.sync.get('Configurations').then((data) => {
                const configs = data.Configurations;
                console.log('[Background] Configs.remove() :: Configurations', configs);

                if (configs !== undefined && configs !== null && configs.length) {
                    const configIdx = configs.findIndex(c => c.UUID === configUUID);
                    console.log('[Background] Configs.remove() :: Config Index', configIdx);

                    if (configIdx > -1) {
                        console.log('[Background] Configs.remove() :: Deleting Config', configs[configIdx]);
                        configs.splice(configIdx, 1);

                        return browser.storage.sync.set({
                            'Configurations': configs
                        });
                    }
                }

                return;
            });
        },

        /**
         * Saves a config to synchronized storage
         * @param {Object} config The config to save
         * @returns {Object} The saved config
         */
        'save': function (config) {
            console.log('[Background] Configs.save()', config);

            return browser.storage.sync.get('Configurations').then((data) => {
                let configs = data.Configurations;
                console.log('[Background] Configs.save() :: Configurations', configs);

                if (configs === undefined || configs === null) {
                    configs = [];
                }

                const configIdx = configs.findIndex(c => c.UUID === config.UUID);
                console.log('[Background] Configs.save() :: Config Index', configIdx);

                if (configIdx > -1) {
                    // replace the existing configuration with the same UUID
                    console.log('[Background] Configs.save() :: Replacing Config', configs[configIdx], config);
                    configs.splice(configIdx, 1, config);
                } else {
                    // append the new configuration to the list
                    console.log('[Background] Configs.save() :: Appending Config', config);
                    configs.push(config);
                }

                return browser.storage.sync.set({
                    'Configurations': configs
                }).then(() => this.get(config.UUID));
            });
        },

        /**
         * Toggles the Enabled property of the config for the specified UUID
         * @param {string} configUUID The UUID of the config to toggle
         * @returns {Object} The updated config
         */
        'toggle': function (configUUID) {
            console.log('[Background] Configs.toggle()', configUUID);
            return this.get(configUUID).then((config) => {
                config.Enabled = !config.Enabled;
                return this.save(config).then(() => this.get(configUUID));
            });
        }

    };

    return Configs;

})();

export default Configs;
