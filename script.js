/* RSVP SETUP: paste your deployed Google Apps Script Web App URL here. */
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycby_ibb_cbKrRxy9KMxudBxmRWmxAcJn42D73VUZP7K9T8JVMuMGNNSgSidmt3JkxwazZg/exec";

const openingScreen = document.getElementById('openingScreen');
const heartStage = document.getElementById('heartStage');
const introVideoStage = document.getElementById('introVideoStage');
const openInvite = document.getElementById('openInvite');
const introVideo = document.getElementById('introVideo');
const mainContent = document.getElementById('mainContent');

const form = document.getElementById('rsvpForm');
const formNote = document.getElementById('formNote');
const formSuccess = document.getElementById('formSuccess');

const music = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');


function setMusicUI(isOn) {
  musicToggle.setAttribute('aria-pressed', String(isOn));
  musicToggle.setAttribute(
    'aria-label',
    isOn ? 'Turn background music off' : 'Turn background music on'
  );

  musicLabel.textContent = isOn ? 'Music on' : 'Music off';
}


async function tryStartMusic() {
  try {
    await music.play();
    setMusicUI(true);
  } catch (e) {
    console.log('Music could not start automatically:', e);
    setMusicUI(false);
  }
}


/* Music ON / OFF button */
musicToggle.addEventListener('click', async () => {

  if (music.paused) {

    music.volume = 0.65;

    try {
      await music.play();
      setMusicUI(true);
    } catch (e) {
      setMusicUI(false);
    }

  } else {

    music.pause();
    setMusicUI(false);

  }

});


/* Reveal normal wedding website */
function revealSite() {

  mainContent.setAttribute('aria-hidden', 'false');

  document.body.classList.remove('locked');

  openingScreen.classList.add('hide');

  musicToggle.classList.add('visible');

  setTimeout(() => {
    document.querySelector('.hero .reveal')?.classList.add('in-view');
  }, 250);

  setTimeout(() => {
    openingScreen.remove();
  }, 900);
}

/* OPEN HEART CLICK */
openInvite.addEventListener('click', () => {

  if (openInvite.disabled) return;
  openInvite.disabled = true;

  /*
   IMPORTANT:
   Start the music during the actual user click.
   Keep it silent while 1.mp4 is playing.
  */
  music.muted = false;
  music.volume = 0;
  music.currentTime = 0;

  const musicPromise = music.play();

  if (musicPromise !== undefined) {
    musicPromise
      .then(() => {
        console.log('Background music authorised');
      })
      .catch((error) => {
        console.log('Background music failed to start:', error);
      });
  }


  /* Switch from heart to video */
  openingScreen.classList.add('video-mode');

  heartStage.setAttribute('aria-hidden', 'true');
  introVideoStage.setAttribute('aria-hidden', 'false');


  /* Start intro video */
  introVideo.currentTime = 0;

  const videoPromise = introVideo.play();

  if (videoPromise !== undefined) {
    videoPromise.catch((error) => {

      console.log('Intro video failed:', error);

      finishIntro();

    });
  }

});


/* FINISH INTRO */
async function finishIntro() {

  /*
   Music should already be playing silently.
   Restart it from the beginning and make it audible.
  */
  try {

    music.currentTime = 0;
    music.volume = 0.65;

    /*
     Normally it is already playing.
     This is only a backup.
    */
    if (music.paused) {
      await music.play();
    }

    setMusicUI(true);

  } catch (error) {

    console.log('Background music could not continue:', error);
    setMusicUI(false);

  }

  revealSite();
}


/* When 1.mp4 finishes */
introVideo.addEventListener(
  'ended',
  finishIntro,
  { once: true }
);


/* If 1.mp4 cannot load */
introVideo.addEventListener(
  'error',
  finishIntro,
  { once: true }
);

/* =========================================
   PERSONALISED GUEST LINKS
========================================= */

const params = new URLSearchParams(location.search);
const guest = params.get('guest');
const maxGuests = Number(params.get('max'));

if (guest) {
  const guestGreeting = document.getElementById('guestGreeting');
  const guestName = document.getElementById('guestName');

  if (guestGreeting) {
    guestGreeting.textContent =
      `Dear ${guest}, together with our families`;
  }

  if (guestName) {
    guestName.value = guest;
  }
}

if (Number.isFinite(maxGuests) && maxGuests > 0) {

  const select = document.getElementById('partySize');

  if (select) {
    [...select.options].forEach(opt => {

      if (
        opt.value &&
        Number(opt.value) > maxGuests
      ) {
        opt.remove();
      }

    });
  }
}



/* =========================================
   COUNTDOWN
========================================= */

const wedding =
  new Date('2026-10-24T09:00:00+05:30').getTime();


function updateCountdown() {

  const diff = wedding - Date.now();

  const countdown =
    document.getElementById('countdown');

  if (!countdown) return;


  if (diff <= 0) {

    countdown.innerHTML = `
      <div style="grid-column:1/-1">
        <strong>Today</strong>
        <span>Our wedding day is here</span>
      </div>
    `;

    return;
  }


  const s = Math.floor(diff / 1000);

  document.getElementById('days').textContent =
    Math.floor(s / 86400);

  document.getElementById('hours').textContent =
    String(
      Math.floor((s % 86400) / 3600)
    ).padStart(2, '0');

  document.getElementById('minutes').textContent =
    String(
      Math.floor((s % 3600) / 60)
    ).padStart(2, '0');

  document.getElementById('seconds').textContent =
    String(s % 60).padStart(2, '0');
}


updateCountdown();

setInterval(updateCountdown, 1000);



/* =========================================
   CALENDAR
========================================= */

const calendarTitle =
  'Darrene & Shehara Wedding';

const calendarDetails =
  'Holy Matrimony at St. Anne’s Church, Kurana at 9.00 AM, followed by the wedding reception at Hotel Royal Ramesses, Seeduwa — Adriana Golden Ballroom from 11.00 AM onwards.';

const calendarLocation =
  'St. Anne’s Church, Kurana / Hotel Royal Ramesses, Seeduwa, Sri Lanka';

const googleDates =
  '20261024T033000Z/20261024T093000Z';


const googleUrl =
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarTitle)}&dates=${googleDates}&details=${encodeURIComponent(calendarDetails)}&location=${encodeURIComponent(calendarLocation)}`;


const googleCalendar =
  document.getElementById('googleCalendar');

if (googleCalendar) {
  googleCalendar.href = googleUrl;
}



const icalCalendar =
  document.getElementById('icalCalendar');

if (icalCalendar) {

  icalCalendar.addEventListener('click', () => {

    const ics = [

      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Darrene and Shehara//Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',

      'UID:darrene-shehara-20261024@wedding',
      'DTSTAMP:20260826T193000Z',
      'DTSTART:20261024T033000Z',
      'DTEND:20261024T093000Z',

      `SUMMARY:${calendarTitle}`,

      `DESCRIPTION:${calendarDetails.replace(/,/g, '\\,')}`,

      `LOCATION:${calendarLocation.replace(/,/g, '\\,')}`,

      'END:VEVENT',
      'END:VCALENDAR'

    ].join('\r\n');


    const blob =
      new Blob(
        [ics],
        { type: 'text/calendar;charset=utf-8' }
      );


    const url =
      URL.createObjectURL(blob);


    const a =
      document.createElement('a');

    a.href = url;

    a.download =
      'Darrene-Shehara-Wedding.ics';

    document.body.appendChild(a);

    a.click();

    a.remove();


    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

  });

}



/* =========================================
   REVEAL WEBSITE CONTENT
========================================= */

/*
  THIS WAS THE IMPORTANT MISSING SECTION.
  Without this, .reveal elements stay invisible.
*/

if ('IntersectionObserver' in window) {

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target
              .classList
              .add('in-view');

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  document
    .querySelectorAll('.reveal')
    .forEach(el => {

      observer.observe(el);

    });

} else {

  /*
    Backup for older browsers
  */

  document
    .querySelectorAll('.reveal')
    .forEach(el => {

      el.classList.add('in-view');

    });

}



/* =========================================
   RSVP
========================================= */

if (RSVP_ENDPOINT && form) {

  form.action =
    RSVP_ENDPOINT;


  if (formNote) {

    formNote.textContent =
      'Your response will be saved privately to our wedding guest list.';

  }


  form.addEventListener(
    'submit',
    () => {

      const button =
        form.querySelector(
          'button[type="submit"]'
        );


      if (!button) return;


      button.disabled = true;

      button.textContent =
        'Sending…';


      if (formSuccess) {
        formSuccess.textContent = '';
      }


      setTimeout(() => {

        if (formSuccess) {

          formSuccess.textContent =
            'Thank you — your RSVP has been sent. We can’t wait to celebrate with you.';

        }


        button.disabled = false;

        button.textContent =
          'RSVP sent ✓';

      }, 1200);

    }
  );


} else if (form) {

  form.addEventListener(
    'submit',
    e => {

      e.preventDefault();

      if (formSuccess) {

        formSuccess.textContent =
          'Connect the Google Sheet endpoint before sharing the website so this RSVP is stored.';

      }

    }
  );

}