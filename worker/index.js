self.addEventListener(
  "push",
  event => {

    if (!event.data) {

      return;

    }

    let data;

    try {

      data =
        event.data.json();

    } catch {

      data = {

        title:
          "Nuevo mensaje",

        body:
          event.data.text(),

        url:
          "/chat",

      };

    }

    const title =
      data.title ??
      "Nuevo mensaje";

    const options = {

      body:
        data.body ??
        "Has recibido un mensaje.",

      icon:
        "/icons/icon-192.png",

      badge:
        "/icons/icon-192.png",

      tag:
        data.conversationId

          ? `chat-${data.conversationId}`

          : "chat-message",

      renotify:
        true,

      data: {

        url:
          data.url ??
          "/chat",

        conversationId:
          data.conversationId ??
          null,

      },

    };

    event.waitUntil(

      self.registration
        .showNotification(
          title,
          options
        )

    );

  }
);

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    const targetUrl =
      event.notification.data?.url ??
      "/chat";

    event.waitUntil(

      self.clients
        .matchAll({

          type:
            "window",

          includeUncontrolled:
            true,

        })
        .then(clients => {

          for (
            const client of clients
          ) {

            const clientUrl =
              new URL(
                client.url
              );

            const target =
              new URL(
                targetUrl,
                self.location.origin
              );

            if (
              clientUrl.origin ===
              target.origin
            ) {

              if (
                "navigate" in client
              ) {

                client.navigate(
                  target.href
                );

              }

              return client.focus();

            }

          }

          return self.clients.openWindow(
            targetUrl
          );

        })

    );

  }
);