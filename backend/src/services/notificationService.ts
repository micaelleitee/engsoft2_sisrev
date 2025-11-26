export async function sendNotificationToUser(userId: number, message: string) {
  // Aqui você integraria com nodemailer (email) ou push (FCM/Expo).
  // No momento, logamos para desenvolvimento.
  console.log(`[NOTIFICATION] user=${userId} message=${message}`);
}
