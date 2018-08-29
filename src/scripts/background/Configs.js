const Configs = (() => {

    const Configs = {

        /**
         * Returns the saved config for the specified UUID
         * @param {string} configUUID The UUID of the config to get
         * @returns {Object} The saved config
         */
        'get': function (configUUID) {
            console.log('[Background] Configs.get()', configUUID);

            return this.getAll().then((configs) => {
                let config;

                if (configs.length) {
                    config = configs.find(c => c.UUID === configUUID);
                }

                console.log('[Background] Configs.get() :: Return', config);
                return config;
            });
        },

        /**
         * Returns all saved configs
         * @returns {Object[]} The saved configs
         */
        'getAll': function() {
            console.log('[Background] Configs.getAll()');

            return browser.storage.sync.get('Configurations').then((data) => {
                let configs = data.Configurations;

                if (configs === undefined || configs === null) {
                    configs = [];
                }

                console.log('[Background] Configs.getAll() :: Return', configs);
                return configs;
            });
        },

        'getMany': function(configUUIDs) {
            console.log('[Background] Configs.getMany()', configUUIDs);

            return this.getAll().then((configs) => {
                configs = configs.filter(c => configUUIDs.indexOf(c.UUID) > -1);

                console.log('[Background] Configs.getMany() :: Return', configs);
                return configs;
            });
        },

        /**
         * Returns all saved configs that are enabled
         * @returns {Object[]} The saved configs that are enabled
         */
        'getAllEnabled': function() {
            console.log('[Background] Configs.getAllEnabled()');

            return this.getAll().then((configs) => {
                if (configs.length) {
                    configs = configs.filter(c => c.Enabled !== false);
                }

                console.log('[Background] Configs.getAllEnabled() :: Return', configs);
                return configs;
            });
        },

        /**
         * Removes the saved config for the specified UUID
         * @param {string} configUUID The UUID of the config to remove
         * @returns {Promise}
         */
        'remove': function (configUUID) {
            console.log('[Background] Configs.remove()', configUUID);

            return this.getAll().then((configs) => {
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
