const Homey = require('homey');

var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');

exports.createActions = function () {

  let setcountdowntimer= new Homey.FlowCardAction('set_countdown_timer', function (callback, args) {
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

let setrandomcountdowntimer = new Homey.FlowCardAction('set_random_countdown_timer', function (callback, args) {
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

let adjustcountdowntimer = new Homey.FlowCardAction('adjust_countdown_timer', function (callback, args) {
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

  let stopcountdowntimer = new Homey.FlowCardAction('stop_countdown_timer', function (callback, args) {
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
});

//let stopallcountdowntimers = new Homey.FlowCardAction('stop_all_countdown_timers', function (callback, args) {

this.countdownstoppedFlowCardTrigger
    .trigger ( tokens, state )
    .catch( this.error )
    .then( this.log )


let stopallcountdowntimers = new Homey.FlowCardAction('stop_all_countdown_timers')
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
         var tokens = { 'variable' : obj.name, 'value' : obj.value };
         var state = { 'variable' : obj.name };
//         Homey.manager('flow').trigger('countdown_stopped', tokens, state);
        this.countdownstoppedFlowCardTrigger
            .trigger ( tokens, state )
            .catch( this.error )
            .then( this.log )
           if (obj) {
              variableManager.updatevariable(obj.name, -1, 'number',setdate);
              callback(null, true);
              return;
           }
      })
      callback(null, false);
});

//}

function isNumber(obj) { return !isNaN(parseFloat(obj)) }

function iskBoolean(bool) {
    return typeof bool === 'boolean' ||
          (typeof bool === 'object' && typeof bool.valueOf() === 'boolean');
}

function getShortDate() {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

}
