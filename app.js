"use strict";

const Homey = require('homey');
//const Log = require('homey-log').Log;

var fs = require('fs');
var variableManager = require('./lib/variablemanagement/variablemanagement.js');
var util = require('./lib/util/util.js');

var autoCompleteActions = require('./lib/autocomplete/actions.js');
var autoCompleteConditions = require('./lib/autocomplete/conditions.js');
var autoCompleteTriggers = require('./lib/autocomplete/triggers.js');

var flowActions = require('./lib/flow/actions.js');
var flowConditions = require('./lib/flow/conditions.js');
//var flowTriggers = require('./lib/flow/triggers.js');

class CountDownApp extends Homey.App {

  onInit() {

    console.log(`${this.id} running...`);

    variableManager.init();

    //var varCollection = Homey.ManagerSettings.get('variables');
    //console.log(varCollection);
  	//autoCompleteActions.createAutocompleteActions();
    //autoCompleteConditions.createAutocompleteConditions();
    //autoCompleteTriggers.createAutocompleteTriggers();

  	//flowActions.createActions();
  	//flowConditions.createConditions();

          this.countdowntozeroFlowCardTrigger = new Homey.FlowCardTrigger('countdown_to_zero')
            .register()
            .registerRunListener((args, state) => {
                if ( args.variable.name == state.variable ) {
                  callback(null,true)
                  return;
                } else {
                  callback(null, false); // true to make the flow continue, or false to abort
              }
              });

          this.countdownstartedFlowCardTrigger = new Homey.FlowCardTrigger('countdown_started')
           .register()
           .registerRunListener((args, state) => {
             if (args.variable.name == state.variable) {
               callback(null,true);
               return;
             } else {
               callback(null, false); // true to make the flow continue, or false to abort
             }
          });


          this.countdownstoppedFlowCardTrigger = new Homey.FlowCardTrigger('countdown_stopped')
           .register()
           .registerRunListener((args, state) => {
            if ( args.variable.name == state.variable ) {
              callback(null,true);
              return;
           } else {
          callback(null, false); // true to make the flow continue, or false to abort
          }
          })

          this.countdowntimerchangedFlowCardTrigger = new Homey.FlowCardTrigger('countdown_timer_changed')
           .register()
           .registerRunListener((args, state) => {
             if ( args.variable.name == state.variable ) {
              //Homey.log(args);
              callback(null,true);
              return;
           } else {
          callback(null, false); // true to make the flow continue, or false to abort
          }
          });


    flowActions.createActions();
    
  	var currentVariables= variableManager.getvariables();
    console.log(currentVariables.length);
  	setInterval(timers_update,1000);
  	function timers_update() {
  		var currentVariables= variableManager.getvariables();
  		//Homey.log(currentVariables);
  	        currentVariables.forEach(function( obj) {
  		 	//Homey.log(obj.name);
  			//Homey.log(obj.value);
        var tokens = { 'variable' : obj.name, 'value' : obj.value };
        var state = { 'variable' : obj.name };
        if (obj.value == 0) {
  				//Homey.log("Value triggered: ",obj.value);
  				// Homey.manager('flow').trigger('countdown_test');
  				//var tokens = { 'variable' : obj.name };
  				//var state = { 'variable' : obj.name };
  				Homey.manager('flow').trigger('countdown_to_zero', tokens, state);
          Homey.manager('flow').trigger('countdown_timer_changed', tokens, state);
  	  		variableManager.updatevariable(obj.name,'-1','number','');
  			}
  			if (obj.value > 0) {
  				variableManager.updatevariable(obj.name, obj.value - 1, 'number','');
          Homey.manager('flow').trigger('countdown_timer_changed', tokens, state);
  			}
  		});
  	};

  }
}

module.exports = CountDownApp;
