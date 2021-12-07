import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('users e2e', () => {
	it('Register -error', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'test@mail.ru',
			password: '1',
		});

		expect(res.statusCode).toBe(422);
	});

	it('login -success', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'dsfsd2f@mail.ru',
			password: '12345',
		});

		expect(res.body.jwt).not.toBeUndefined();
	});

	it('login -error', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'dsfsd2f@mail.ru',
			password: '1',
		});

		expect(res.statusCode).toBe(401);
	});

	it('info -success', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'dsfsd2f@mail.ru',
			password: '12345',
		});
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer ${login.body.jwt}`);

		expect(res.body.email).toBe('dsfsd2f@mail.ru');
	});
});

afterAll(() => {
	application.close();
});
