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

    function isNumber(obj) { return !isNaN(parseFloat(obj)) }

    function getShortDate() {
        var now = new Date();
        var year = "" + now.getFullYear();
        var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    //var varCollection = Homey.ManagerSettings.get('variables');
    //console.log(varCollection);
  	//autoCompleteActions.createAutocompleteActions();
    //autoCompleteConditions.createAutocompleteConditions();
    //autoCompleteTriggers.createAutocompleteTriggers();

  	//flowActions.createActions();
  	//flowConditions.createConditions();


//
//
// Triggers
//

          var countdowntozeroFlowCardTrigger = new Homey.FlowCardTrigger('countdown_to_zero')
            .register()
            .registerRunListener((args, state) => {
                if ( args.variable.name == state.variable ) {
                  callback(null,true)
                  return;
                } else {
                  callback(null, false); // true to make the flow continue, or false to abort
              }
              });

          var countdownstartedFlowCardTrigger = new Homey.FlowCardTrigger('countdown_started')
           .register()
           .registerRunListener((args, state) => {
             if (args.variable.name == state.variable) {
               callback(null,true);
               return;
             } else {
               callback(null, false); // true to make the flow continue, or false to abort
             }
          });


          var countdownstoppedFlowCardTrigger = new Homey.FlowCardTrigger('countdown_stopped')
           .register()
           .registerRunListener((args, state) => {
            if ( args.variable.name == state.variable ) {
              callback(null,true);
              return;
           } else {
          callback(null, false); // true to make the flow continue, or false to abort
          }
          })

          var countdowntimerchangedFlowCardTrigger = new Homey.FlowCardTrigger('countdown_timer_changed')
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


//
//
// ACTIONS
//

// autoCompleteActions

//var setcountdowntimer_autocomplete = new Homey.FlowCard.getargument('set_countdown_timer[variable.autocomplete]', function (callback, value) {
//    callback(null, variableManager.getvariables().filter(util.filterVariable(value, 'number')));
//});


//


    var setcountdowntimer= new Homey.FlowCardAction('set_countdown_timer', function (callback, args) {
            console.log('set countdown timer');
             var setdate = getShortDate();
             if (args.variable && args.variable.name) {
              var variable = variableManager.getvariable(args.variable.name);
              var tokens = { 'variable' : args.variable.name };
              var state = { 'variable' : args.variable.name };
              console.log(tokens);
              Homey.manager('flow').trigger('countdown_started', tokens, state);
              if (variable) {
                variableManager.updatevariable(args.variable.name, args.value, 'number',setdate);
                  callback(null, true);
                  return;
              }
         }
          callback(null, false);

  });

var setrandomcountdowntimer = new Homey.FlowCardAction('set_random_countdown_timer', function (callback, args) {
         var setdate = getShortDate();
         if (args.variable && args.variable.name) {
          var variable = variableManager.getvariable(args.variable.name);
          if (variable) {
              //the *1 is to make a number of args.valuemin
              var newtimer = Math.floor(Math.random() * (args.valuemax - args.valuemin + 1) + args.valuemin*1);
              variableManager.updatevariable(args.variable.name, newtimer, 'number',setdate);
              callback(null, true);
              return;
          }
     }
      callback(null, false);

  });

  var adjustcountdowntimer = new Homey.FlowCardAction('adjust_countdown_timer', function (callback, args) {
        console.log('adjust countdown timer');
         var setdate = getShortDate();
         if (args.variable && args.variable.name) {
          var variable = variableManager.getvariable(args.variable.name);
          var tokens = { 'variable' : args.variable.name };
          var state = { 'variable' : args.variable.name };
          //Homey.log(tokens);
          //Homey.log(args.value);
          var newTimervalue = Number(args.value) + Number(variable.value);
          console.log(Number(newTimervalue));
          //Homey.manager('flow').trigger('countdown_started', tokens, state);
          if (variable) {
            variableManager.updatevariable(args.variable.name, newTimervalue, 'number',setdate);
              callback(null, true);
              return;
          }
     }
      callback(null, false);
  });

//    var stopcountdowntimer = new Homey.FlowCardAction('stop_countdown_timer', function (callback, args) {
var stopcountdowntimer = new Homey.FlowCardAction('stop_countdown_timer')
stopcountdowntimer
  .register()
  .registerRunListener(( args, state ) => {
            console.log('stop countdown timer');
             var setdate = getShortDate();
             if (args.variable && args.variable.name) {
                var variable = variableManager.getvariable(args.variable.name);
                var tokens = { 'variable' : args.variable.name };
                var state = { 'variable' : args.variable.name };
                Homey.manager('flow').trigger('countdown_stopped', tokens, state);
                if (variable) {
                  variableManager.updatevariable(args.variable.name, -1, 'number',setdate);
                  callback(null, true);
                  return;
                }
              }
            callback(null, false);
  })
  let stopcountdowntimerMyArg = stopcountdowntimer.getArgument('variable');
  stopcountdowntimerMyArg.registerAutocompleteListener( ( function (callback, value) {
      callback(null, variableManager.getvariables().filter(util.filterVariable(value, 'number')));
  }));

  //let stopallcountdowntimers = new Homey.FlowCardAction('stop_all_countdown_timers', function (callback, args) {

// WERKEND
  var stopallcountdowntimers = new Homey.FlowCardAction('stop_all_countdown_timers')
  stopallcountdowntimers
    .register()
    .registerRunListener(( args, state ) => {
        console.log('stop all countdown timers');
        var setdate = getShortDate();
        var currentVariables= variableManager.getvariables();
        //Homey.log(currentVariables);
        currentVariables.forEach(function( obj) {
           console.log(obj.name);
           console.log(obj.value);
           console.log('----')
           var tokens = { 'variable' : obj.name, 'value' : obj.value };
           var state = { 'variable' : obj.name };
  //         Homey.manager('flow').trigger('countdown_stopped', tokens, state);
          countdownstoppedFlowCardTrigger
              .trigger ( tokens, state )
              .catch( countdownstoppedFlowCardTrigger.error )
              .then( countdownstoppedFlowCardTrigger.log )
             if (obj) {
                console.log('update to -1')
                variableManager.updatevariable(obj.name, -1, 'number',setdate);
                //callback(null, true);
                return;
             }
        })
        //callback(null, false);
  });


//
//
//  CONDITIONS
//

Homey.manager('flow').on('condition.timer_running', function (callback, args) {
    if (args.variable) {
        var variable = variableManager.getvariable(args.variable.name);
        if (variable && variable.value < 0 ) {
            Homey.log('timer_running');
            callback(null, true);
            return;
        }
    }
    callback(null, false);
});

Homey.manager('flow').on('condition.timer_matches_number', function (callback, args) {
    if (args.variable) {
        var variable = variableManager.getvariable(args.variable.name);
        if (variable && variable.value === args.value) {
            Homey.log('timer_matches_number');
            callback(null, true);
            return;
        }
    }
    callback(null, false);
});



//
//
// PROGRAM
//

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
          this.countdowntozeroFlowCardTrigger
              .trigger ( tokens, state )
              .catch( this.error )
              .then( this.log )
          this.countdowntimerchangedFlowCardTrigger
              .trigger ( tokens, state )
              .catch( this.error )
              .then( this.log )
  	  		variableManager.updatevariable(obj.name,'-1','number','');
  			}
  			if (obj.value > 0) {
  				variableManager.updatevariable(obj.name, obj.value - 1, 'number','');
          this.countdowntimerchangedFlowCardTrigger
              .trigger ( tokens, state )
              .catch( this.error )
              .then( this.log )
  			}
  		});
  	};

  }
}

module.exports = CountDownApp;
