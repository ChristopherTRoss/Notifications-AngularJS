var app = angular.module('notificationApp', ['ui-notification']);

app.controller('notificationController', function ($scope, Notification) {
  var notificationId = 1;
  var newDate = new Date();
  var notificationTitle = 'Test Title';
  var notificationContents = 'Contents';

  $scope.primaryHtml = function (notificationTitle, notificationContents) {
    Notification.primary({
      message: notificationContents,
      title: notificationTitle,
      delay: 10000,
    });
    var notificationTime =
      ('0' + newDate.getHours()).slice(-2) +
      ':' +
      ('0' + newDate.getMinutes()).slice(-2) +
      ':' +
      ('0' + newDate.getSeconds()).slice(-2);
    console.log('Notification: [Time: ' + notificationTime, ', ID: ' + notificationId + ']');
    notificationId++;
  };

  $scope.compareTimeStamps = function (notificationArray) {
    for (var i = 0; i < notificationArray.length; i++) {
      notificationArray[i].TimeStamp = notificationArray[i].TimeStamp.split(":").join('');
      newDate = new Date();
      var currentTime = (newDate.getHours()) + ':' + ('0' + newDate.getMinutes()).slice(-2);
      currentTime = currentTime.split(":").join('');
      var timeDifference = currentTime - notificationArray[i].TimeStamp;
      if (timeDifference == 0) {
        $scope.primaryHtml(notificationArray[i].Title, notificationArray[i].Contents);
      }
    }
  }

  var notificationArray = [];
  function buildNotificationArray(notification) {
    var i = 0;
    notificationArray = [];
    while (notification[i] != null && notification[i + 1] != null && notification[i + 2] != null) {
      var notificationObject = { Title: notification[i], Contents: notification[i + 1], TimeStamp: notification[i + 2] };
      notificationArray.push(notificationObject);
      i += 3;
    }
  }

  function mainNotificationFunction() {
    var notification = [];
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", 'input.txt', true);
    txtFile.onreadystatechange = function () {
      if (txtFile.readyState === 4) {
        if (txtFile.status === 200 || txtFile.status == 0) {
          var result = txtFile.responseText;
          notification = result.split(/[\n,]/).map(function (item) {
            return item.trim();
          });
          notification = notification.filter(Boolean) //Removes blank elements from array
          buildNotificationArray(notification);
          $scope.compareTimeStamps(notificationArray);
        }
      }
    }
    txtFile.send(null);
  }
  mainNotificationFunction();
  setInterval(function () {
    mainNotificationFunction();
  }, 60000) //Calls function every 60 seconds
});

app.directive('notificationDirective', function () {
  function link(scope, element, attributes, controller) { }
  return {
    controller: 'notificationController',
    link: link,
    require: 'notificationDirective',
    restrict: 'A,E',
  };
});
