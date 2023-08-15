

/*:
 * @plugindesc Triggers a Common Event when the player is idle for a certain time.
 * @author Danyerusama
 * 
 * @param enabled
 * @desc If this plugin is enabled.
 * @type boolean
 * @default true
 *
 * @param commonEventId
 * @desc The ID of the Common Event to trigger when the player is idle.
 * @type common_event
 * @default 1
 *
 * @param idleTime
 * @desc The amount of idle time (in seconds) before triggering the Common Event.
 * @type number
 * @default 10
 *
 * @help
 *=============================================================================
 * DYR_IdleCommonEvent.js
 * Author: Danyerusama
 * Version: 1.0.1
 *============================================================================= 
 *
 * == Parameters ==
 * - enabled: If this plugin is enabled.
 * - commonEventId: The ID of the Common Event to trigger when the player is idle.
 * - idleTime: The amount of idle time (in seconds) before triggering the Common Event.
 *
 * == Usage ==
 * To use, simply install the plugin and set the desired Common Event ID and idle time in the plugin parameters.
 * You can also use a script call to enable or disable the plugin during events.
 *
 * == Script Call ==
 * - To enable the plugin: IdleCommonEventEnable()
 * - To disable the plugin: IdleCommonEventDisable()
 *
 * When the plugin is disabled, it won't trigger the Common Event, and the player can move freely without any idle event.
 * 
 * == Copyright Notice ==
 * This plugin is created by Danyerusama and is protected by copyright laws.
 * © 2023 Danyerusama. All rights reserved.
 * 
 * Terms of Use:
 * You are allowed to use this plugin in both free and commercial games.
 * To edit the code, please contact the author via E-mail at "danyerusama >>gmail<<" and obtain approval.
 * 
 * Ownership and Redistribution:
 * This plugin remains the intellectual property of Danyerusama.
 * Please do not claim this plugin as your own or redistribute it without explicit permission.
 * Modifying the filename, parameters, and plugin information is not allowed.
 * 
 * Credit and Attribution:
 * If you use code from this plugin for your own released plugins or projects, ensure to give proper credit to the original author (Danyerusama).
 * 
 * Thank you for your understanding and cooperation.
 */

(function() {
    // Get plugin parameters
    var parameters = PluginManager.parameters('DYR_IdleCommonEvent');
    var enabled = parameters['enabled'] === 'true';
    var commonEventId = Number(parameters['commonEventId'] || 1);
    var idleTime = Number(parameters['idleTime'] || 10);
    
    var idleTimer = 0;
    var commonEventTriggered = false;

    var _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        if (!enabled || !sceneActive) {
            _Game_Player_update.call(this, sceneActive);
            return;
        }

        if (!this.isMoving()) {
            idleTimer += 1.0 / 60.0; // assuming 60 FPS
            if (idleTimer >= idleTime && !commonEventTriggered) {
                SceneManager._scene.triggerCommonEvent();
                commonEventTriggered = true;
            }
        } else {
            idleTimer = 0; // Reset the idle timer when the player is moving
            if (commonEventTriggered) {
                SceneManager._scene.dismissCommonEvent();
            }
        }

        _Game_Player_update.call(this, sceneActive);
    };

    Scene_Map.prototype.triggerCommonEvent = function() {
        $gameTemp.reserveCommonEvent(commonEventId);
        this._interpreter = new Game_Interpreter();
        this._interpreter.setup($dataCommonEvents[commonEventId].list);
    };

    Scene_Map.prototype.dismissCommonEvent = function() {
        commonEventTriggered = false;
    };

    // Script call to enable the plugin
    window.IdleCommonEventEnable = function() {
        enabled = true;
    };

    // Script call to disable the plugin
    window.IdleCommonEventDisable = function() {
        enabled = false;
    };
})();
