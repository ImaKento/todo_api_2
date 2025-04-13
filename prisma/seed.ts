import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.todos.deleteMany();

  await prisma.todos.createMany({
    data: [
      {
        title: 'SQL文の基礎学習',
        body: 'select, insert等を学ぶ',
        dueDate: new Date('2025-04-06'),
      },
      {
        title: 'MAMPの学習',
        body: 'ドットインストールでPHPから始める',
        dueDate: new Date('2025-05-02'),
      },
      {
        title: '歯医者を予定する',
      },
      {
        title: 'オンライン英会話のレッスン予約',
        body: 'ライアン先生を予約する',
      },
      {
        title: '書類をスキャンしてPDF化',
        body: '大学提出用の証明書類',
        dueDate: new Date('2025-04-05'),
        completedAt: new Date('2025-04-04'),
      },
      {
        title: 'Reactの勉強をする',
        body: 'HooksとContext APIを重点的に',
        dueDate: new Date('2025-04-07'),
        completedAt: new Date('2025-04-04'),
      },
    ]
  });
}

main()
  .then(() => {
    console.log('🌱 Seed data inserted');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Error seeding data: ', e);
    prisma.$disconnect();
    process.exit(1);
  });