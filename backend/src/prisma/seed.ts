import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  try {

    await prisma.exame.deleteMany();
    await prisma.medicacao.deleteMany();
    await prisma.prontuario.deleteMany();
    await prisma.consulta.deleteMany();
    await prisma.medico.deleteMany();
    await prisma.paciente.deleteMany();
    await prisma.usuario.deleteMany();

    console.log('Criando usuário administrador...');
    const adminPassword = await bcrypt.hash('admin123', 12);

    const admin = await prisma.usuario.create({
      data: {
        email: 'admin@susdigital.com',
        senha: adminPassword,
        tipo: 'ADMIN',
        ativo: true
      }
    });
    console.log('✅ Admin criado:', admin.email);

    console.log('Criando médicos...');

    const medico1User = await prisma.usuario.create({
      data: {
        email: 'dr.joao@susdigital.com',
        senha: await bcrypt.hash('medico123', 12),
        tipo: 'MEDICO',
        ativo: true
      }
    });

    const medico1 = await prisma.medico.create({
      data: {
        nome: 'Dr. João Silva',
        crm: '12345-SP',
        especialidade: 'Clínico Geral',
        telefone: '(11) 99999-1111',
        usuarioId: medico1User.id
      }
    });

    const medico2User = await prisma.usuario.create({
      data: {
        email: 'dra.maria@susdigital.com',
        senha: await bcrypt.hash('medico123', 12),
        tipo: 'MEDICO',
        ativo: true
      }
    });

    const medico2 = await prisma.medico.create({
      data: {
        nome: 'Dra. Maria Santos',
        crm: '67890-RJ',
        especialidade: 'Cardiologia',
        telefone: '(21) 88888-2222',
        usuarioId: medico2User.id
      }
    });

    console.log('✅ Médicos criados:', medico1.nome, medico2.nome);

    console.log('Criando pacientes...');

    const paciente1User = await prisma.usuario.create({
      data: {
        email: 'ana.costa@email.com',
        senha: await bcrypt.hash('paciente123', 12),
        tipo: 'PACIENTE',
        ativo: true
      }
    });

    const paciente1 = await prisma.paciente.create({
      data: {
        nome: 'Ana Costa',
        cpf: '123.456.789-00',
        dataNascimento: new Date('1985-03-15'),
        telefone: '(11) 77777-3333',
        endereco: 'Rua das Flores, 123',
        cartaoSus: '123456789012345',
        usuarioId: paciente1User.id
      }
    });

    const paciente2User = await prisma.usuario.create({
      data: {
        email: 'carlos.lima@email.com',
        senha: await bcrypt.hash('paciente123', 12),
        tipo: 'PACIENTE',
        ativo: true
      }
    });

    const paciente2 = await prisma.paciente.create({
      data: {
        nome: 'Carlos Lima',
        cpf: '987.654.321-00',
        dataNascimento: new Date('1978-11-20'),
        telefone: '(11) 66666-4444',
        endereco: 'Av. Brasil, 456',
        cartaoSus: '987654321098765',
        usuarioId: paciente2User.id
      }
    });

    console.log('✅ Pacientes criados:', paciente1.nome, paciente2.nome);

    console.log('Criando consultas de exemplo...');

    const consulta1 = await prisma.consulta.create({
      data: {
        dataHora: new Date('2024-12-20T10:00:00.000Z'),
        motivo: 'Consulta de rotina',
        observacoes: 'Paciente em bom estado geral',
        status: 'AGENDADA',
        medicoId: medico1.id,
        pacienteId: paciente1.id
      }
    });

    const consulta2 = await prisma.consulta.create({
      data: {
        dataHora: new Date('2024-12-21T14:30:00.000Z'),
        motivo: 'Consulta cardiológica',
        observacoes: 'Paciente com histórico familiar',
        status: 'AGENDADA',
        medicoId: medico2.id,
        pacienteId: paciente2.id
      }
    });

    console.log('✅ Consultas criadas');

    console.log('Criando prontuários...');

    const prontuario1 = await prisma.prontuario.create({
      data: {
        diagnostico: 'Hipertensão arterial leve',
        sintomas: 'Dor de cabeça ocasional, tontura',
        tratamento: 'Medicação anti-hipertensiva, dieta',
        observacoes: 'Acompanhar pressão arterial semanalmente',
        pacienteId: paciente1.id
      }
    });

    await prisma.medicacao.create({
      data: {
        nome: 'Losartana',
        dosagem: '50mg',
        frequencia: '1 vez ao dia',
        duracao: '30 dias',
        instrucoes: 'Tomar pela manhã, com água',
        prontuarioId: prontuario1.id
      }
    });

    console.log('✅ Prontuários e medicações criados');

    console.log('Criando exames...');

    await prisma.exame.create({
      data: {
        tipo: 'LABORATORIAL',
        nome: 'Hemograma completo',
        dataExame: new Date('2024-12-15T08:00:00.000Z'),
        observacoes: 'Exame de rotina',
        consultaId: consulta1.id
      }
    });

    console.log('✅ Exames criados');

    console.log('================================');
    console.log('✅ Seed executado com sucesso!');
    console.log('================================');
    console.log('');
    console.log('USUÁRIOS CRIADOS:');
    console.log('Admin: admin@susdigital.com / admin123');
    console.log('Médico 1: dr.joao@susdigital.com / medico123');
    console.log('Médico 2: dra.maria@susdigital.com / medico123');
    console.log('Paciente 1: ana.costa@email.com / paciente123');
    console.log('Paciente 2: carlos.lima@email.com / paciente123');
    console.log('');
    console.log('DADOS CRIADOS:');
    console.log('5 usuários');
    console.log('2 médicos');
    console.log('2 pacientes');
    console.log('2 consultas');
    console.log('1 prontuário');
    console.log('1 medicação');
    console.log('1 exame');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Falha no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Desconectado do banco de dados');
  });