import {
  PrismaClient,
  Prisma,
  Role,
  Theme,
} from "@prisma/client";

const prisma = new PrismaClient();

/* ======================================================
   UTILIDADES
====================================================== */

function randomInt(
  min: number,
  max: number
) {
  return (
    Math.floor(
      Math.random() *
        (max - min + 1)
    ) + min
  );
}

function randomElement<T>(
  array: T[]
): T {
  return array[
    randomInt(
      0,
      array.length - 1
    )
  ];
}

function randomPrice(
  min: number,
  max: number
) {
  return new Prisma.Decimal(
    randomInt(min, max)
  );
}

function randomCoordinate(
  base: number
) {
  return new Prisma.Decimal(
    (
      base +
      (Math.random() - 0.5) *
        0.08
    ).toFixed(6)
  );
}

function randomDateThisMonth() {
  const now = new Date();

  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    8,
    0,
    0
  );

  return new Date(
    start.getTime() +
      Math.random() *
        (now.getTime() -
          start.getTime())
  );
}

/* ======================================================
   DATOS MAESTROS
====================================================== */

const branchLocations = {
  "Casa Matriz": {
    lat: -33.4489,
    lng: -70.6693,
  },
  "Providencia": {
    lat: -33.4213,
    lng: -70.6062,
  },
  "Centro": {
    lat: -33.4372,
    lng: -70.6506,
  },
  "Norte": {
    lat: -33.4015,
    lng: -70.6724,
  },
};

const categoryData = [
  {
    name: "Bebidas",
    color: "#3C83F6",
  },
  {
    name: "Snacks",
    color: "#F59E0B",
  },
  {
    name: "Abarrotes",
    color: "#8B5CF6",
  },
  {
    name: "Lácteos",
    color: "#10B981",
  },
  {
    name: "Frutas",
    color: "#EF4444",
  },
  {
    name: "Limpieza",
    color: "#64748B",
  },
];

const articleData = {
  Bebidas: [
    "Coca Cola 350cc",
    "Pepsi 350cc",
    "Fanta 350cc",
    "Sprite 350cc",
    "Agua Mineral",
    "Jugo Watts",
  ],

  Snacks: [
    "Doritos",
    "Ramitas",
    "Papas Lays",
    "Cheetos",
    "Maní Salado",
  ],

  Abarrotes: [
    "Arroz 1kg",
    "Fideos Espiral",
    "Azúcar 1kg",
    "Harina 1kg",
    "Aceite 1L",
  ],

  "Lácteos": [
    "Leche Colún",
    "Yogurt Soprole",
    "Queso Gauda",
    "Mantequilla",
  ],

  Frutas: [
    "Manzana",
    "Plátano",
    "Naranja",
    "Pera",
  ],

  Limpieza: [
    "Cloro",
    "Detergente",
    "Lavalozas",
    "Esponja",
    "Papel Higiénico",
  ],
};

/* ======================================================
   LIMPIAR BD
====================================================== */

async function cleanDatabase() {

  await prisma.saleDetail.deleteMany();

  await prisma.sale.deleteMany();

  await prisma.article.deleteMany();

  await prisma.category.deleteMany();

  await prisma.user.deleteMany();

  await prisma.branch.deleteMany();

  await prisma.company.deleteMany();

}

/* ======================================================
   EMPRESAS
====================================================== */

async function createCompanies() {

  const company1 =
    await prisma.company.create({
      data: {
        name: "Supermercado ABC",
        theme: Theme.DEFAULT,
      },
    });

  const company2 =
    await prisma.company.create({
      data: {
        name: "Minimarket Don José",
        theme: Theme.GREEN,
      },
    });

  return [
    company1,
    company2,
  ];

}

/* ======================================================
   SUCURSALES
====================================================== */

async function createBranches(
  companies: any[]
) {

  const branches = [];

  branches.push(

    await prisma.branch.create({
      data: {
        companyId:
          companies[0].id,
        name: "Casa Matriz",
        address:
          "Av. Providencia 1234",
      },
    })

  );

  branches.push(

    await prisma.branch.create({
      data: {
        companyId:
          companies[0].id,
        name: "Providencia",
        address:
          "Los Leones 350",
      },
    })

  );

  branches.push(

    await prisma.branch.create({
      data: {
        companyId:
          companies[1].id,
        name: "Centro",
        address:
          "Alameda 500",
      },
    })

  );

  branches.push(

    await prisma.branch.create({
      data: {
        companyId:
          companies[1].id,
        name: "Norte",
        address:
          "Independencia 720",
      },
    })

  );

  return branches;

}

/* ======================================================
   USUARIOS
====================================================== */

async function createUsers(
  companies: any[],
  branches: any[]
) {

  const users = [];

  const definitions = [

    {
      name: "Administrador",
      role: Role.ADMIN,
    },

    {
      name: "Gerente",
      role: Role.MANAGER,
    },

    {
      name: "Caja 1",
      role: Role.CASHIER,
    },

    {
      name: "Caja 2",
      role: Role.CASHIER,
    },

    {
      name: "Caja 3",
      role: Role.CASHIER,
    },

  ];

  for (const company of companies) {

    const companyBranches =
      branches.filter(
        branch =>
          branch.companyId ===
          company.id
      );

    for (const branch of companyBranches) {

      for (const definition of definitions) {

        users.push(

          await prisma.user.create({

            data: {

              companyId:
                company.id,

              branchId:
                branch.id,

              name:
                definition.name,

              email:
                `empresa${company.id}.sucursal${branch.id}.${definition.name
                  .toLowerCase()
                  .replace(/\s+/g, "")}@demo.cl`,

              role:
                definition.role,

              theme:
                Theme.DEFAULT,

            },

          })

        );

      }

    }

  }

  return users;

}

/* ======================================================
   CATEGORÍAS
====================================================== */

async function createCategories(
  companies: any[]
) {

  const categories = [];

  for (const company of companies) {

    for (const category of categoryData) {

      categories.push(

        await prisma.category.create({
          data: {

            companyId:
              company.id,

            name:
              category.name,

            color:
              category.color,

          },
        })

      );

    }

  }

  return categories;

}

/* ======================================================
   ARTÍCULOS
====================================================== */

async function createArticles(
  companies: any[],
  categories: any[]
) {

  const articles = [];

  for (const company of companies) {

    const companyCategories =
      categories.filter(
        (category) =>
          category.companyId ===
          company.id
      );

    let code = 1001;

    for (const category of companyCategories) {

      const products =
        articleData[
          category.name as keyof typeof articleData
        ];

      for (const description of products) {

        articles.push(

          await prisma.article.create({

            data: {

              companyId:
                company.id,

              categoryId:
                category.id,

              code:
                String(code++),

              description,

              unitPrice:
                randomPrice(
                  800,
                  6500
                ),

            },

          })

        );

      }

    }

  }

  return articles;

}

/* ======================================================
   VENTAS
====================================================== */

async function createSales(
  companies: any[],
  branches: any[],
  users: any[],
  articles: any[]
) {

  for (const company of companies) {

    const companyBranches =
      branches.filter(
        (branch) =>
          branch.companyId ===
          company.id
      );

    const cashiers =
      users.filter(
        (user) =>
          user.companyId ===
            company.id &&
          user.role ===
            Role.CASHIER
      );

    const companyArticles =
      articles.filter(
        (article) =>
          article.companyId ===
          company.id
      );

    const salesCount =
      randomInt(45, 60);

    for (
      let i = 0;
      i < salesCount;
      i++
    ) {

const selectedBranch =
  randomElement(
    companyBranches
  );

const branchCashiers =
  cashiers.filter(
    cashier =>
      cashier.branchId ===
      selectedBranch.id
  );

const selectedUser =
  randomElement(
    branchCashiers
  );

      const selectedDate =
        randomDateThisMonth();

      let total =
        new Prisma.Decimal(0);

      const details = [];

const productsInSale =
  randomInt(1, 5);

const selectedArticles =
  [...companyArticles]
    .sort(() => Math.random() - 0.5)
    .slice(0, productsInSale);

for (const article of selectedArticles) {

  const quantity =
    randomInt(1, 4);

  const subtotal =
    article.unitPrice.mul(
      quantity
    );

  total =
    total.plus(subtotal);

  details.push({

    articleId:
      article.id,

    quantity,

    unitPrice:
      article.unitPrice,

    subtotal,

  });

}

const location =
  branchLocations[
    selectedBranch.name as keyof typeof branchLocations
  ];

      await prisma.sale.create({

        data: {

          companyId:
            company.id,

          branchId:
            selectedBranch.id,

          userId:
            selectedUser.id,

          createdAt:
            selectedDate,

latitude:
  randomCoordinate(
    location.lat
  ),

longitude:
  randomCoordinate(
    location.lng
  ),

          total,

          details: {

            create:
              details,

          },

        },

      });

    }

  }

}

/* ======================================================
   MAIN
====================================================== */

async function main() {

  console.log(
    "Limpiando base de datos..."
  );

  await cleanDatabase();

  console.log(
    "Creando empresas..."
  );

  const companies =
    await createCompanies();

  console.log(
    "Creando sucursales..."
  );

  const branches =
    await createBranches(
      companies
    );

  console.log(
    "Creando usuarios..."
  );

  const users =
    await createUsers(
      companies,
      branches
    );

  console.log(
    "Creando categorías..."
  );

  const categories =
    await createCategories(
      companies
    );

  console.log(
    "Creando artículos..."
  );

  const articles =
    await createArticles(
      companies,
      categories
    );

  console.log(
    "Generando ventas..."
  );

  await createSales(
    companies,
    branches,
    users,
    articles
  );

  console.log("");

  console.log(
    "✔ Seed ejecutado correctamente."
  );

}

main()
  .catch(console.error)
  .finally(async () => {

    await prisma.$disconnect();

  });