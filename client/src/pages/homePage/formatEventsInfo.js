const formatEventsInfo = (userEvents) => {
  let attendedVisits = 0;
  const formatedInfo = [];
  let visitsInThisYear = 0;
  userEvents.forEach((item, index) => {
    if (
      new Date(item.appointmentDate).getFullYear() === new Date().getFullYear()
    ) {
      visitsInThisYear += 1;
      if (item.attended) {
        attendedVisits += 1;
      }
    }
    if (!item.attended) {
      formatedInfo.push({
        id: index,
        startDate: new Date(item.appointmentDate),
        endDate: new Date(item.appointmentDate),
        name: item.service.name,
        serviceId: item.service._id,
        lastVisit: item.lastVisitDate,
        appointmentId: item._id,
      });
    }
  });
  formatedInfo.sort((a, b) => a.startDate - b.startDate);
  const currentPercentage = (attendedVisits / visitsInThisYear) * 100 || 0;
  return {
    percentage: currentPercentage.toFixed(1),
    formatedInfo,
  };
};

export default formatEventsInfo;
