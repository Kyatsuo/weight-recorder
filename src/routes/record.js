const { Hono } = require('hono');
const { html } = require('hono/html');
const layout = require('../layout');
const ensureAuthenticated = require('../middlewares/ensure-authenticated');
const { randomUUID } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });

const app = new Hono();

app.use(ensureAuthenticated());

app.get('/', (c) => {
  return c.html(
    layout(
      c,
      null,
        html`
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="card-title mb-4">今日の体重を入力</h2>

              <form method="post" action="/record">
                <div class="mb-3">
                  <label for="weight" class="form-label">体重 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    class="form-control"
                    id="weight"
                    name="weight"
                    placeholder="例：67.8"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label for="memo" class="form-label">メモ</label>
                  <textarea
                    class="form-control"
                    id="memo"
                    name="memo"
                    rows="4"
                    placeholder="例：食べ過ぎた"
                  ></textarea>
                </div>

                <div class="d-flex justify-content-between">
                  <a href="/" class="btn btn-outline-secondary">
                    戻る
                  </a>

                  <button type="submit" class="btn btn-primary">
                    体重を記録
                  </button>
                </div>
              </form>
            </div>
          </div>
        `
    ),
  );
});

app.post('/', async (c) => {
  const { user } = c.get('session') ?? {};
  const body = await c.req.parseBody();

  //体重を登録
  const { weightId } = await prisma.weight.create({
    data: {
      weightId: randomUUID(),
      date: new Date(),
      weight: Number(body.weight),
      memo: body.memo || '',
      createdBy: user.id,
    }

  })

  // 作成した予定のページにリダイレクト
  return c.redirect('/', 303);
});

module.exports = app;