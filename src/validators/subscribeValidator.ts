export type SubscribeValues = {
  userNumber: string;
  birthDate: string;
  examDate: string;
  email: string;
};

export type SubscribeErrors = Partial<Record<keyof SubscribeValues, string>>;

export function validateSubscribe(body: Record<string, unknown>) {
  const userNumber = String(body.userNumber ?? '').trim();
  const birthDate = String(body.birthDate ?? '');
  const examDate = String(body.examDate ?? '');
  const email = String(body.email ?? '').trim(); 
  
  const errors: SubscribeErrors = {};

  if (!userNumber) errors.userNumber = 'Bitte geben Sie die Teilnehmernummer ein.';
  if (!birthDate) errors.birthDate = 'Bitte geben Sie Ihr Geburtsdatum ein.';
  if (!examDate) errors.examDate = 'Bitte geben Sie das Prüfungsdatum ein.';
  if (!email) errors.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';

  const values: SubscribeValues = { userNumber, birthDate, examDate, email };

  return { values, errors };
}