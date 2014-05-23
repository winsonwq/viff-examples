angular.module('viffReport')
  .directive('scrollToMapPosition', function ($window) {
    return function (scope, element, attributes) {
      var diffImageHeight, envImage, envImageHeightDiff;
      var diffVisualHeight = $(window).height() - (43 + 35 + 60);
      var originalSrc = element[0].src;

      angular.element($window).bind("scroll", function () {
        if (originalSrc !== element[0].src) {
          envImage = {
            height: element.height(),
            parentHeight: element.parent().height()
          };
          diffImageHeight = $(".diffImage img").height();
          envImageHeightDiff = envImage.height - envImage.parentHeight;
        }

        if (!envImage) {
          return;
        }
        setBlankHeight(envImage);

        var offsetY = $(document).scrollTop();
        var offsetValue = parseInt(offsetY / diffImageHeight * envImage.height);
        imageTopPosition = (envImageHeightDiff < offsetValue) ? (0 - envImageHeightDiff) : (0 - offsetValue);
        setElementTopPosition(imageTopPosition);

        scope.$apply();
      });

      function setElementTopPosition(imagePosition) {
        element.css('top', imagePosition);
      }

      function setBlankHeight(envImage) {
        var blankHeight = diffVisualHeight - (envImage.parentHeight * diffImageHeight / envImage.height);
        $(".blank").height() < blankHeight && $(".blank").height(blankHeight);
      }
    }
  });
