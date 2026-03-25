const MENU_DATA = [
  {
    id: 'entradas',
    name: 'Entradas',
    items: [
      {
        name: 'Alitas Crispy',
        description: '8 UNIDADES. Alitas ahumadas crispy. Papa francesa y salsa a elección.',
        price: 8
      },
      {
        name: 'Quesadillas Smoke',
        description: 'Tortillas con queso fundido, crema agria, brisket, pulled pork o mixta.',
        hideVariants: true,
        variants: [
          { name: 'Brisket', price: 10 },
          { name: 'Pulled Pork', price: 10 },
          { name: 'Mixta', price: 10 }
        ]
      },
      {
        name: 'Papas Smoke',
        description: 'Papas francesas con queso fundido, cebollin, brisket, pulled pork o mixta, salsa a elección.',
        hideVariants: true,
        variants: [
          { name: 'Brisket', price: 10 },
          { name: 'Pulled Pork', price: 10 },
          { name: 'Mixta', price: 10 }
        ]
      },
      {
        name: 'Canastas Smoke',
        description: 'Cestas de platano verde frito, con brisket, pulled pork y longaniza, coronadas con pico de gallo y guasacaca.',
        price: 10
      },
      {
        name: 'Longaniza de Brisket',
        price: 3
      },
      {
        name: 'Longaniza de Cheddar Jalapeño',
        price: 3
      }
    ]
  },
  {
    id: 'humo',
    name: 'Humo',
    items: [
      {
        name: 'Costillar de Cerdo St Luis',
        description: 'Deliciosas costillas de cerdo ahumadas por 6 horas. Sabor Original o en Salsa bbq. Pídela en nuestras 2 presentaciones. Coleslaw, papa francesa o papa criolla y salsa a elección.',
        variants: [
          { name: 'Rack Entero', price: 40 },
          { name: 'Medio Rack', price: 22 }
        ]
      },
      {
        name: 'Brisket Angus Americano',
        description: 'Nuestra joya texana, ahumada por 14 horas. Brisket, longaniza, pan, coleslaw, papas criollas o francesas y salsa a elección.',
        price: 30
      },
      {
        name: 'Brisket Nacional',
        description: 'Novillo AA, ahumado por 14 horas. Brisket, longaniza, pan, coleslaw, papas criollas o francesas y salsa a elección.',
        price: 20
      },
      {
        name: 'Pork Belly',
        description: 'Crujiente panceta de cerdo con piel ahumada suavemente por 6 horas, acevichado limón papas criollas o francesa.',
        price: 16
      },
      {
        name: 'Cerdo Ahumado',
        description: 'Bondiola de cerdo ahumada por 7 horas. Longaniza, pan, coleslaw, papa criolla o francesa y salsa a elección.',
        price: 14
      }
    ]
  },
  {
    id: 'bbq',
    name: 'Adictos al BBQ',
    items: [
      {
        name: 'Familiar',
        description: '(4 personas) Brisket N, Pulled pork, alitas crispy, cerdo ahumado, pork belly. longanizas, pan, coleslaw, papas rusticas o francesas y salsas a elección.',
        price: 60
      },
      {
        name: 'Duo',
        description: '(2 personas) Brisket N, Pulled pork, alitas crispy, cerdo ahumado, longaniza, pan, coleslaw, papa rustica o francesa y salsa a elección.',
        price: 28
      }
    ]
  },
  {
    id: 'hamburguesas',
    name: 'Hamburguesas',
    items: [
      {
        name: 'Top Smoke',
        description: '150 Gr. Lonja de brisket, 150Gr. de pulled pork, queso cheddar, tocineta, pepinillos, tomate, lechuga, papas francesa, salsa de la casa.',
        price: 14
      },
      {
        name: 'Brisket Burger',
        description: '150 Gr. Lonja de brisket, queso cheddar, tocineta, pepinillos, tomate, lechuga, papas francesa, salsa de la casa.',
        price: 12
      },
      {
        name: 'Blu Smoke',
        description: 'Doble croqueta de res ahumada, Queso cheddar Cebolla, tomate, lechuga, Pepinillos, tocineta, papas francesas y salsa de la casa.',
        price: 10
      },
      {
        name: 'Pit Smoke',
        description: '80 Gr. pulled pork, 80 Gr pulled beef, coleslaw, queso cheddar, pepinillo papas francesa, salsa de la casa.',
        price: 10
      },
      {
        name: 'Smoke Burger',
        description: '180 Gr. Croqueta de res ahumada, queso cheddar, tocineta, pepinillos, tomate, lechuga, papas francesa, salsa de la casa.',
        price: 8
      },
      {
        name: 'Crispy Smoke',
        description: '170 Gr. de croqueta de pechuga de pollo ahumada crispy, queso cheddar, tocineta, tomate, lechuga, papas francesa, salsa de la casa.',
        price: 8
      },
      {
        name: 'Pulled Burger',
        description: '150 Gr. Pulled Pork de la casa ahumado, queso cheddar, coleslaw papas francesa, salsa de la casa.',
        price: 8
      }
    ]
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    items: [
      {
        name: 'Pastrami',
        description: 'Pan ciabatta, corte de Res curado por mas de 72 horas y luego ahumado por 14 horas 180. Gr. Lonjas de pastrami, queso gouda, pepinillos, salsa de la casa.',
        price: 12
      },
      {
        name: 'Brisket',
        description: 'Pan ciabatta, 180. Gr. de brisket ahumado, queso gouda, pepinillos, salsa de la casa.',
        price: 12
      },
      {
        name: 'Pulled Pork',
        description: 'Pan ciabatta, 200 Gr. de pulled pork ahumado, queso gouda, pepinillos, salsa de la casa.',
        price: 12
      }
    ]
  },
  {
    id: 'tacos',
    name: 'Tacos',
    items: [
      {
        name: 'Tacos Ahumados',
        description: '3 Presentaciones únicas con nuestro sabor ahumado, queso amarillo, cilantro, cebolla, guasacaca, crema agria y limón',
        price: 12
      }
    ]
  },
  {
    id: 'infantil',
    name: 'Infantil',
    items: [
      {
        name: 'Chicken Tenders',
        description: 'Filetes de pechuga de pollo ahumados y crujientes acompañados de papas a la francesa.',
        price: 7
      },
      {
        name: 'Jr Smoke Burguer',
        description: 'Croqueta de res ahumada, queso, salsa de la casa, acompañado de papas a la francesa.',
        price: 6
      }
    ]
  },
  {
    id: 'acomp',
    name: 'Acompañamientos',
    layout: 'grid',
    items: [
      { name: 'Ensalada Cesar', price: 4 },
      { name: 'Papas Francesas', price: 3 },
      { name: 'Papas Criolla', price: 2 },
      { name: 'Coleslaw', price: 2 },
      { name: 'Pico de Gallo', price: 2 }
    ]
  },
  {
    id: 'salsas',
    name: 'Salsas',
    layout: 'badges',
    subtitle: 'a eleccion',
    items: [
      { name: 'BBQ Original' },
      { name: 'BBQ Piña Manzana' },
      { name: 'Guasacaca' },
      { name: 'Chimichurri' },
      { name: 'Picante' },
      { name: 'Tartara', price: 10000 } 
    ]
  },
  {
    id: 'bebidas',
    name: 'Para Beber',
    items: [
      { name: 'Granizado', description: 'Limón o Parchita', price: 2 },
      { name: 'Refresco de Lata', price: 2 },
      { name: 'Soda', price: 2 },
      { name: 'Nestea', description: 'Limón o Durazno', price: 2 },
      { name: 'Caroreña Verano', price: 2 },
      { name: 'Agua 600ml', price: 1.5 },
      {
        name: 'Cerveza',
        variants: [
          { name: 'Solera Verde', price: 1.5 },
          { name: 'Polar Negra', price: 1 },
          { name: 'Polar Light', price: 1 },
          { name: 'Solera Azul', price: 1 },
          { name: 'Zulia', price: 1 }
        ]
      }
    ]
  }
];