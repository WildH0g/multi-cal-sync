// jshint esversion: 9
// jshint laxbreak: true

const main = () => {

  const events = LocalCal.sync(CalendarApp.getDefaultCalendar().getId());

  MCSFile.write({
    events
  });  
};

const removeKey = () => {
  LocalCal.removeToken();
};