import webPush from "web-push";

const publicKey =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

const privateKey =
  process.env.VAPID_PRIVATE_KEY;

const subject =
  process.env.VAPID_SUBJECT;

if (
  !publicKey ||
  !privateKey ||
  !subject
) {

  throw new Error(
    "Faltan las variables VAPID para Web Push."
  );

}

webPush.setVapidDetails(
  subject,
  publicKey,
  privateKey
);

export {
  webPush,
};