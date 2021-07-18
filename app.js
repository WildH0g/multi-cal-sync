// jshint esversion: 9
// jshint laxbreak: true

const main = () => {
  const e = LocalCal.sync(CalendarApp.getDefaultCalendar().getId());

  MCSFile.write({
    ...e,
  });
};

const removeKey = () => {
  LocalCal.removeToken();
};
