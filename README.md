# 🚀 Pharmix Back

Backend da aplicação **Pharmix**, construído com foco em escalabilidade, organização e boas práticas usando NestJS e Prisma.

---

## 🧱 Stack do Projeto

| Categoria      | Tecnologia          | Descrição                                 |
| -------------- | ------------------- | ----------------------------------------- |
| Backend        | NestJS              | Framework Node.js estruturado e escalável |
| ORM            | Prisma              | ORM moderno com tipagem forte             |
| Linguagem      | TypeScript          | Tipagem estática para maior segurança     |
| Banco de Dados | PostgreSQL / SQLite | Banco relacional (dev e produção)         |
| Autenticação   | JWT                 | Autenticação baseada em tokens            |
| Validação      | class-validator     | Validação de dados via DTOs               |
| Configuração   | @nestjs/config      | Gerenciamento de variáveis de ambiente    |

---

## 📁 Estrutura de Pastas

```bash
src/
├── main.ts
├── app.module.ts

├── config/
│   └── env.config.ts

├── database/
│   ├── prisma.module.ts
│   └── prisma.service.ts

├── modules/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   └── jwt.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/
│   │   ├── dto/
│   │   │   └── create-user.dto.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts

├── common/
│   ├── decorators/
│   ├── guards/
│   ├── filters/
│   └── interceptors/

├── utils/
│   └── hash.ts

prisma/
├── schema.prisma

.env
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DATABASE_URL="sua_connection_string"
JWT_SECRET="sua_chave_secreta"
```

---

## ▶️ Rodando o Projeto

```bash
npm install
npm run start:dev
```

Servidor rodando em:

```
http://localhost:3000
```

---

## 🧠 Padrões Utilizados

* **Modularização por domínio (modules/)**
* **Separação de responsabilidades (Controller / Service)**
* **Prisma como camada de acesso ao banco**
* **DTOs para validação e tipagem**
* **Config centralizado com .env**

---

## 🔥 Objetivo

Esse projeto serve como base para:

* APIs escaláveis
* Integração com apps mobile (React Native)
* Autenticação segura com JWT
* Estrutura pronta para crescimento

---

## 📌 Próximos passos

* [ ] Implementar autenticação completa (login/register)
* [ ] Criar CRUD de usuários
* [ ] Integração com app mobile
* [ ] Deploy (Docker / Cloud)

---
