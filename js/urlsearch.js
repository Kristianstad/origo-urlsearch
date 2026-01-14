function keySimulation({ key = "Enter", elementId = "hjl", eventType = "keyup" } = {}) {
  try {
    const event = new KeyboardEvent(eventType, {
      key,
      code: key,
      keyCode: key === "Enter" ? 13 : 0,
      which: key === "Enter" ? 13 : 0,
      bubbles: true,
      cancelable: true
    });

    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`keySimulation: Element with ID '${elementId}' not found.`);
      return;
    }

    element.dispatchEvent(event);
  } catch (error) {
    console.error(`keySimulation: Error dispatching ${eventType} event`, error);
  }
}

function finishSearch(hideSearchInfo = "false") {
  const zoom = getUrlParam('zoom');
  const checkInterval = 100; /* Check every 100ms */
  const maxAttempts = 100; /* 10 seconds total (100 * 100ms) */
  const hideTimeoutDuration = 5000; /* 5 seconds for hiding */
  let attempts = 0;

  /* Temporarily hide suggestion lists */
  const list1 = document.querySelector("#awesomplete_list_1");
  const list2 = document.querySelector("#awesomplete_list_2");
  if (list1) list1.style.display = "none";
  if (list2) list2.style.display = "none";

  function zoomLoop(view, zoomLevel, zoomMaxAttempts, zoomAttempt = 1 ) {
    let currentZoom;
    setTimeout(() => {
      if (zoomAttempt <= zoomMaxAttempts) {
        try {
          currentZoom = view.getZoom();
          /*console.log("zoomAttempt: " + zoomAttempt + ", currentzoom: " + currentZoom);*/
          if (currentZoom != zoomLevel) {
            view.setZoom(zoomLevel);
          } else {
            zoomLoop(view, zoomLevel, zoomMaxAttempts, zoomAttempt + 1);
          }
        } catch (zoomError) {
          console.error(`finishSearch: Error setting zoom level`, zoomError);
        }
      }
    }, 500);
  }

  function tryClick() {
    const suggestion1 = document.querySelector("#awesomplete_list_1 > li > div.suggestion");
    const suggestion2 = document.querySelector("#awesomplete_list_2 > li > div.suggestion");

    if (suggestion1 || suggestion2) {
      try {
        /* Click the suggestion (still works even if parent is hidden) */
        (suggestion1 || suggestion2).click();

        /* Apply zoom if valid */
        if (zoom) {
          const zoomLevel = parseInt(zoom, 10);
          if (!isNaN(zoomLevel)) {
		    let view = origo.api().getMap().getView();
		    view.setZoom(zoomLevel);
			zoomLoop(view, zoomLevel, 15);
          } else {
            console.warn(`finishSearch: Invalid zoom parameter '${zoom}'`);
          }
        }

        /* Restore visibility of suggestion lists after click */
        if (list1) list1.style.display = "";
        if (list2) list2.style.display = "";

        if (hideSearchInfo === "true") {
          /* Check and hide both #o-popup and #sidebarcontainer if they exist */
          const targets = ["#o-popup", "#sidebarcontainer"];
          targets.forEach(targetElement => {
            let hideObserver = new MutationObserver((hideMutations, hideObs) => {
              const element = document.querySelector(targetElement);
              if (element) {
                element.style.display = "none";
                hideObs.disconnect();
              }
            });

            hideObserver.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
              hideObserver.disconnect();
              if (!document.querySelector(targetElement)) {
                console.warn(`finishSearch: Target element ${targetElement} not found after ${hideTimeoutDuration}ms.`);
              }
            }, hideTimeoutDuration);
          });
        }
      } catch (e) {
        console.error("finishSearch: Error clicking suggestion", e);
        /* Restore visibility if click fails */
        if (list1) list1.style.display = "";
        if (list2) list2.style.display = "";
      }
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(tryClick, checkInterval);
    } else {
      console.warn("finishSearch: Timed out waiting for suggestions after", maxAttempts * checkInterval, "ms.");
      /* Restore visibility on timeout */
      if (list1) list1.style.display = "";
      if (list2) list2.style.display = "";
    }
  }

  tryClick();
}

function urlsearch() {
  let poim = getUrlParam('poim') || getUrlParam('poi');
  const hideSearchInfo = getUrlParam('hideSearchInfo') === "true" ? "true" : "false";
  if (poim) {
	  try {
		  poim = decodeURI(poim);
	  } catch (e) {
		  console.warn("Event listener: Error decoding poim/poi", e);
		  return;
	  }
	  let input = document.getElementById("hjl");
	  if (input) {
		  input.value = poim;
		  keySimulation();
		  setTimeout(() => finishSearch(hideSearchInfo), 100);
	  } else {
		  console.warn("Event listener: Element with ID 'hjl' not found.");
	  }
  }
}
