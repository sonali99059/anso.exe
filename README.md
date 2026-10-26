# Campus Event Hub

Campus Event Hub is a responsive, frontend-only college event discovery and registration prototype built with HTML, CSS, and vanilla JavaScript.

## Features

- Browse eight sample upcoming campus events.
- Search events by title, category, description, or venue.
- Filter events by category using the dropdown or category chips.
- Sort events by soonest or latest date.
- Open a details dialog for each event before registering.
- Open a registration form for an event.
- Validate required student details in the browser.
- Prevent duplicate registrations for the same event in this browser.
- View saved registrations and cancel a registration.
- Keep demo registrations in browser `localStorage` across refreshes.
- Responsive navigation and layout for desktop and mobile.

## Project structure

```text
campus-event-hub/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── README.md
```

## Run the website

1. Download and extract `campus-event-hub.zip`.
2. Open VS Code.
3. Select **File → Open Folder** and choose the extracted `campus-event-hub` folder.
4. Open `index.html` in a browser by double-clicking it in File Explorer. A local preview extension is optional; no installation or build step is required.

## Customize sample events

Open `js/main.js` and edit the `EVENTS` array near the top. Each event has an ID, title, category, date, time, location, description, visual style, and sample spot count. Keep each event ID unique. The current sample event dates are in November 2026.

## Registration storage and privacy

- Demo registrations are saved in the current browser's `localStorage` under the key `campusEventHubRegistrations`.
- Registrations are not sent to the college, a server, or other users and are not shared between browsers or devices.
- Anyone with access to the same browser profile may be able to view the saved demo registrations.
- Do not enter sensitive personal information. This prototype does not provide authentication or secure storage and is not suitable for real student registrations.
- Clearing browser site data may remove saved registrations.

To clear registrations, open the site, press **F12**, select the browser Developer Tools **Console**, and run:

```js
localStorage.removeItem("campusEventHubRegistrations");
location.reload();
```

## Limitations

This is a frontend demonstration only. It has no backend, database, real login, email confirmation, or central college registration system. Event descriptions and spot counts are sample data.
