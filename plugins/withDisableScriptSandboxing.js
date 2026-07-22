const { withXcodeProject } = require('expo/config-plugins');

module.exports = function withDisableScriptSandboxing(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    
    for (const key in configurations) {
      if (typeof configurations[key] === 'object') {
        const buildSettings = configurations[key].buildSettings;
        if (buildSettings) {
          buildSettings['ENABLE_USER_SCRIPT_SANDBOXING'] = 'NO';
        }
      }
    }
    
    return config;
  });
};
