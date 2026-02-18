export type TelcCheckParams = {
  userNumber: string; // Teilnehmernummer
  birthDate: Date;    // Geburtsdatum
  examDate: Date;     // Prüfungsdatum (в твоей терминологии)
  evalDate: Date;     // дата проверки/выдачи (pruefung в URL из твоего примера)
  type?: 'paper' | 'digital';
};

/**
 * true  -> найден сертификат
 * false -> не найден (certificate not found)
 * null  -> ошибка (сеть/5xx/неожиданный ответ)
 * пример правильного запроса: https://results.telc.net/api/results/loopkup/12345678/pruefung/2024-06-01/birthdate/1990-01-01?type=paper
 * пример ответа при найденном сертификате: {""examinationInstituteId": "69e...", "examId": "abc123...", "attendeeId": "def456", ... }
 * пример ответа при не найденном сертификате: 404 Not Found или { "code": 404, "message": "certificate not found" }
 */
export async function telcCheck(params: TelcCheckParams): Promise<boolean | null> {
  const type = params.type ?? 'paper';
  console.log(`[telcCheck] Checking certificate for userNumber=${params.userNumber}, examDate=${toYmd(params.examDate)}, evalDate=${toYmd(params.evalDate)}, type=${type}`);

  // telc ожидает YYYY-MM-DD
  const birthdate = toYmd(params.birthDate);
  const pruefung = toYmd(params.evalDate);

  // в будущем воможно делать два запроса, на бумажный и цифровой сертификат
  const url =
    `https://results.telc.net/api/results/loopkup/${encodeURIComponent(params.userNumber)}` +
    `/pruefung/${encodeURIComponent(pruefung)}` +
    `/birthdate/${encodeURIComponent(birthdate)}` +
    `?type=${encodeURIComponent(type)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(5_000),
    });

    console.log(`[telcCheck] Received response: ${res.ok} ${res.statusText} for URL: ${url}`);

    const data: unknown = await res.json();

    if (isTelcSuccessResponse(data)) {
      console.warn('[telcCheck] certificate found:', { examId: data.examId, attendeeId: data.attendeeId });
      return true;
    }

    console.warn('[telcCheck] certificate not found, response:', data);

    // JSON есть, но сертификата нет
    return false;
  } catch (err) {
    // сеть / таймаут / JSON parse error
    console.warn('[telcCheck] request failed', err);
    return null;
  }
}

function toYmd(d: Date): string {
  // Важно: берём календарную дату (UTC), чтобы не получить смещение из-за timezone/DST
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isTelcSuccessResponse(data: unknown): data is {
  examId: string;
  attendeeId: string;
} {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.examId === 'string' &&
    typeof obj.attendeeId === 'string'
  );
}
