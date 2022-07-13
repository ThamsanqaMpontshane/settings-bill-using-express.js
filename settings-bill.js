const moment = require('moment'); // require
moment().format(); 

module.exports = function SettingsBill() {

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel; 

    let actionList = [];

    function setSettings (settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = Number(settings.warningLevel);
        criticalLevel = Number(settings.criticalLevel);
    }

    function getSettings
    () {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function recordAction(action) {

        let cost = 0;
        if (action === 'sms'){
            cost = smsCost;
        }
        else if (action === 'call'){
            cost = callCost;
        }

        actionList.push({
            type: action,
            cost,
            timestamp: moment(new Date()).fromNow()
        });
    }

    function actions(){
        return actionList;
    }

    function actionsFor(type){
        const filteredActions = [];

        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // add the action to the list
                filteredActions.push(action);
            }
        }

        return filteredActions;

        // return actionList.filter((action) => action.type === type);
    }

    function getTotal(type) {
        let total = 0;
        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // if it is add the total to the list
                total += action.cost;
            }
        }
        return total;
    }

    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function totals() {
        let smsTotal = getTotal('sms')
        let callTotal = getTotal('call')
        return {
            smsTotal,
            callTotal,
            grandTotal : grandTotal()
        }
    }

    function hasReachedWarningLevel(){

        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel 
            && total < criticalLevel;

        return reachedWarningLevel;
    }

    function hasReachedCriticalLevel(){
        const total = grandTotal();
        return total >= criticalLevel;
    }

    function totalClassName(){
        const total = grandTotal();
        if (hasReachedCriticalLevel()){
            return 'danger';
        }
        else if (hasReachedWarningLevel()){
            return 'warning';
        }
    }


    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel,
        totalClassName
    }
}