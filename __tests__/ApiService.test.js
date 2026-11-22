import ApiService, {
  ApiError,
  extractMessage,
  setAuthToken,
  setUnauthorizedHandler,
} from '../src/services/ApiService';
import { API_BASE_URL } from '../src/config';

function mockResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => (body === undefined ? '' : JSON.stringify(body)),
  };
}

beforeEach(() => {
  global.fetch = jest.fn();
  setAuthToken(null);
  setUnauthorizedHandler(null);
});

describe('ApiService', () => {
  test('login mengirim POST tanpa header Authorization', async () => {
    setAuthToken('token-lama');
    global.fetch.mockResolvedValue(mockResponse(200, { access_token: 'abc', user: { id: 1 } }));
    const result = await ApiService.login('uji@mail.com', 'rahasia1');
    expect(result.access_token).toBe('abc');
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe(`${API_BASE_URL}/auth/login`);
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBeUndefined();
    expect(JSON.parse(options.body)).toEqual({ email: 'uji@mail.com', password: 'rahasia1' });
  });

  test('permintaan terautentikasi membawa token Bearer', async () => {
    setAuthToken('abc');
    global.fetch.mockResolvedValue(mockResponse(200, []));
    await ApiService.getModules({ topic: 'python' });
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe(`${API_BASE_URL}/modules?topic=python`);
    expect(options.headers.Authorization).toBe('Bearer abc');
  });

  test('parameter kosong tidak ikut di query string', async () => {
    global.fetch.mockResolvedValue(mockResponse(200, []));
    await ApiService.getModules({ topic: '', level: undefined });
    expect(global.fetch.mock.calls[0][0]).toBe(`${API_BASE_URL}/modules`);
  });

  test('submitQuiz mengirim jawaban', async () => {
    setAuthToken('abc');
    global.fetch.mockResolvedValue(mockResponse(200, { score: 3 }));
    await ApiService.submitQuiz(7, [{ question_id: 1, answer_index: 2 }]);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe(`${API_BASE_URL}/quizzes/7/submit`);
    expect(JSON.parse(options.body)).toEqual({ answers: [{ question_id: 1, answer_index: 2 }] });
  });

  test('status error dilempar sebagai ApiError dengan pesan dari server', async () => {
    global.fetch.mockResolvedValue(mockResponse(409, { detail: 'Email sudah terdaftar' }));
    await expect(ApiService.register('Uji', 'uji@mail.com', 'rahasia1')).rejects.toMatchObject({
      name: 'ApiError',
      status: 409,
      message: 'Email sudah terdaftar',
    });
  });

  test('401 pada permintaan bertoken memanggil handler sesi habis', async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    setAuthToken('abc');
    global.fetch.mockResolvedValue(mockResponse(401, { detail: 'Autentikasi diperlukan' }));
    await expect(ApiService.getProgress()).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('401 pada login (salah password) tidak memanggil handler', async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    global.fetch.mockResolvedValue(mockResponse(401, { detail: 'Email atau password salah' }));
    await expect(ApiService.login('a@b.co', 'x')).rejects.toMatchObject({ status: 401 });
    expect(handler).not.toHaveBeenCalled();
  });

  test('server tidak terjangkau menjadi ApiError status 0 yang ramah', async () => {
    global.fetch.mockRejectedValue(new TypeError('Network request failed'));
    await expect(ApiService.getModules()).rejects.toMatchObject({
      status: 0,
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet.',
    });
  });

  test('timeout menjadi pesan khusus', async () => {
    const abort = new Error('aborted');
    abort.name = 'AbortError';
    global.fetch.mockRejectedValue(abort);
    await expect(ApiService.getModules()).rejects.toMatchObject({
      status: 0,
      message: 'Server tidak merespons. Coba lagi sebentar lagi.',
    });
  });

  test('jawaban bukan JSON tidak membuat aplikasi crash', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 502, text: async () => '<html>Bad Gateway</html>' });
    await expect(ApiService.getModules()).rejects.toMatchObject({
      status: 502,
      message: 'Terjadi kesalahan pada server (kode 502)',
    });
  });
});

describe('extractMessage', () => {
  test('detail berupa daftar (422) menjadi pesan umum', () => {
    expect(extractMessage({ detail: [{ msg: 'x' }] }, 422)).toBe('Data yang dikirim tidak valid');
  });
  test('tanpa detail memakai kode status', () => {
    expect(extractMessage(null, 500)).toBe('Terjadi kesalahan pada server (kode 500)');
  });
});
