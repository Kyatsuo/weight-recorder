const { Hono } = require('hono');
const { html } = require('hono/html');
const layout = require('../layout');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });

const app = new Hono();

function weightTable(weights) {
  return html`
    <table class="table table-striped table-hover align-middle">
      <tr>
        <th>日付</th>
        <th>体重(kg)</th>
        <th>前日との差</th>
        <th>開始日との差</th>
        <th>メモ</th>
      </tr>

      ${weights.map((weight, index) => {
        const previousWeight = weights[index - 1];

        const previousDifference = previousWeight
          ? Math.round((weight.weight - previousWeight.weight) * 10) / 10
          : null;

        const startDifference =
          Math.round((weight.weight - weights[0].weight) * 10) / 10;

        return html`
          <tr>
            <td>${weight.date.toLocaleDateString('ja-JP').replaceAll('/', '-')}</td>
            <td>${weight.weight}kg</td>

            <td>
              ${previousDifference === null
                ? '-'
                : previousDifference >= 0
                  ? `+${previousDifference}`
                  : previousDifference}kg
            </td>

            <td>
              ${index === 0
                ? '-'
                : startDifference >= 0
                  ? `+${startDifference}`
                  : startDifference}kg
            </td>

            <td>${weight.memo}</td>
          </tr>
        `;
      })}
    </table>
  `;
}

app.get('/', async (c) => {
  const { user } = c.get('session') ?? {};

  const weights = user
    ? await prisma.weight.findMany({
        where: { createdBy: user.id },
        orderBy: { date: 'asc' },
      })
    : [];

return c.html(
  layout(
    c,
    null,
    html`
      <div class="my-3">

        <!-- ログイン状態 -->
        <div class="d-flex justify-content-end">
          ${user
            ? html`
                <a href="/logout" class="btn btn-outline-secondary">
                  ログアウト
                </a>
              `
            : html`
                <a href="/login" class="btn btn-primary">
                  ログイン
                </a>
              `}
        </div>

        <div class="p-5 bg-light rounded-3">
          <h1 class="text-body">体重記録くん</h1>
          <p class="lead">
            毎日の体重を記録しよう
          </p>
        </div>

        ${user
          ? html`
              <div class="my-3">
                <p>
                  <a href="/record" class="btn btn-primary">
                    体重を記録する
                  </a>
                </p>

                ${weights.length > 0
                  ? html`
                      <div class="card shadow-sm">
                        <div class="card-body">
                          <h3 class="card-title">体重記録</h3>
                          ${weightTable(weights)}
                        </div>
                      </div>
                    `
                  : ''}
              </div>
            `
          : ''}
      </div>
    `,
  ),
);
});

module.exports = app;