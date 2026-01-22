import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar laboratórios
  const lab1 = await prisma.laboratory.upsert({
    where: { name: 'Laboratório 01' },
    update: {},
    create: {
      name: 'Laboratório 01',
      description: 'Laboratório de Informática 01',
      capacity: 30,
      isActive: true
    }
  });

  const lab2 = await prisma.laboratory.upsert({
    where: { name: 'Laboratório 02' },
    update: {},
    create: {
      name: 'Laboratório 02',
      description: 'Laboratório de Informática 02',
      capacity: 30,
      isActive: true
    }
  });

  const lab3 = await prisma.laboratory.upsert({
    where: { name: 'Laboratório 03' },
    update: {},
    create: {
      name: 'Laboratório 03',
      description: 'Laboratório de Informática 03',
      capacity: 25,
      isActive: true
    }
  });

  const lab4 = await prisma.laboratory.upsert({
    where: { name: 'Laboratório 04' },
    update: {},
    create: {
      name: 'Laboratório 04',
      description: 'Laboratório de Informática 04',
      capacity: 25,
      isActive: true
    }
  });

  const lab5 = await prisma.laboratory.upsert({
    where: { name: 'Laboratório 05' },
    update: {},
    create: {
      name: 'Laboratório 05',
      description: 'Laboratório de Informática 05',
      capacity: 20,
      isActive: true
    }
  });

  console.log('✅ Laboratórios criados');

  // Criar disciplinas
  const disciplines = [
    'Engenharia de Software 2',
    'Engenharia de Software 1',
    'Banco de Dados',
    'Estruturas de Dados',
    'Programação Orientada a Objetos',
    'Redes de Computadores',
    'Segurança da Informação',
    'Desenvolvimento Mobile',
    'Inteligência Artificial',
    'Gestão de Projetos'
  ];

  for (const name of disciplines) {
    await prisma.discipline.upsert({
      where: { name },
      update: {},
      create: {
        name,
        code: name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000)
      }
    });
  }

  console.log('✅ Disciplinas criadas');

  // Criar usuário de teste (professor)
  const hashedPassword = await bcrypt.hash('micael', 10);
  const professor = await prisma.user.upsert({
    where: { email: 'micael@ifce.edu.br' },
    update: {},
    create: {
      email: 'micael@ifce.edu.br',
      password: hashedPassword,
      name: 'Micael',
      role: 'PROFESSOR'
    }
  });

  console.log('✅ Usuário de teste criado (micael@ifce.edu.br / micael)');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

