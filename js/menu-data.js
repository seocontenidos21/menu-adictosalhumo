const MENU_DATA = [
  {
    id: 'humo',
    name: 'Humo',
    items: [
      {
        name: 'Costillar de Cerdo St Luis',
        description: 'Deliciosas costillas de cerdo ahumadas por 6 horas. Coleslaw, contorno a elección y salsa a elección.',
        variants: [
          { name: 'Rack Entero (1 kg)', price: 20 },
          { name: 'Medio Rack (500 gr)', price: 10 }
        ]
      },
      {
        name: 'Brisket Angus Certified Prime',
        description: 'Nuestra joya texana, ahumada por 14 horas. 200 Gr. Brisket, coleslaw, contorno a elección y salsa a elección.',
        price: 10
      },
      {
        name: 'Muslo Entero de Pollo',
        description: 'Ahumado por 4 horas. Coleslaw, papa criolla o francesa y salsa a elección.',
        price: 5
      },
      {
        name: 'Pork Belly Ahumado',
        description: 'Panceta de cerdo con piel ahumada por 5 horas. 400 Grs + papa criolla o francesa, limón y salsa a elección.',
        price: 10
      },
      {
        name: 'Alitas Crispy',
        description: 'Muslo de alita crispy ahumada o bañadas en salsa bbq. Coleslaw, papa francesa y salsa a elección.',
        variants: [
          { name: '12 Unidades', price: 10 },
          { name: '6 Unidades', price: 5 }
        ]
      },
      {
        name: 'Longaniza Artesanal',
        description: 'Longaniza de brisket · Longaniza Cheddar Jalapeño',
        price: 3
      }
    ]
  },
  {
    id: 'grilla',
    name: 'Grilla',
    items: [
      {
        name: 'Rib Eye',
        description: 'Novillo doble AA Garantizado. 350 Gr. Acompañante a elección y chimichurri.',
        price: 15
      },
      {
        name: 'Pechuga de Pollo',
        description: '400 Gr. Acompañante a elección y chimichurri.',
        price: 10
      }
    ]
  },
  {
    id: 'bbq',
    name: 'Adictos al BBQ',
    items: [
      {
        name: 'Bandeja 1 Persona',
        description: '100 Gr. Brisket, 100 Gr. Pulled pork, 2 alitas crispy, longaniza, coleslaw. Papa rustica o francesa y salsa a elección.',
        price: 8
      },
      {
        name: 'Bandeja 2 Personas',
        description: '200 Gr. Brisket, 200 Gr. Pulled pork, muslo de pollo, longaniza, 2 costillas St Luis. Coleslaw, papa rustica o francesa y salsa a elección.',
        price: 20
      },
      {
        name: 'Bandeja 4 Personas',
        description: '400 Gr. Brisket, 300 Gr. Pulled pork, 2 muslo de pollo ahumado, 4 alitas crispy, 2 longanizas, Medio rack de costillas St Luis, coleslaw, papas rusticas o francesas y salsas a elección.',
        price: 45
      }
    ]
  },
  {
    id: 'hamburguesas',
    name: 'Hamburguesas',
    items: [
      {
        name: 'Brisket Burger',
        description: '200 Gr. Croqueta, queso cheddar, tocineta, pepinillos, salsa de la casa. Acompañados de papas a la francesa.',
        price: 6
      },
      {
        name: 'Pulled Burger',
        description: '200 Gr. Pulled Pork de la casa ahumado, queso cheddar, coleslaw. Acompañado de papas a la francesa.',
        price: 6
      }
    ]
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    items: [
      {
        name: 'Pastrami',
        description: 'Corte de Res curado por más de 72 horas y luego ahumado por 14 horas. 200 Gr. Lonjas de pastrami, queso holandés, mostaza, salsa de la casa. Acompañado de papas a la francesa.',
        price: 10
      }
    ]
  },
  {
    id: 'tacos',
    name: 'Tacos',
    items: [
      {
        name: 'Brisket · Pulled Pork · Longaniza',
        description: '3 Presentaciones únicas, queso mozzarella, cilantro, cebolla, guasacaca y limón.',
        price: 10
      }
    ]
  },
  {
    id: 'infantil',
    name: 'Infantil',
    items: [
      {
        name: 'Chiken Tender',
        description: '5 Filetes de pechuga de pollo ahumados y crujientes acompañados de papas a la francesa.',
        price: 5
      }
    ]
  },
  {
    id: 'acomp',
    name: 'Acompañamientos',
    layout: 'grid',
    items: [
      { name: 'Coleslaw', price: 1 },
      { name: 'Ensalada Cesar', price: 3 },
      { name: 'Mac & Cheese', price: 3 },
      { name: 'Maíz Salteado', price: 3 },
      { name: 'Papas Francesas', price: 2 },
      { name: 'Papas Criolla', price: 2 }
    ]
  },
  {
    id: 'salsas',
    name: 'Salsas',
    layout: 'badges',
    subtitle: 'Incluidas a elección con tu pedido',
    items: [
      { name: 'BBQ Original' },
      { name: 'BBQ Piña Manzana' },
      { name: 'BBQ Tai' },
      { name: 'Guasacaca' },
      { name: 'Chimichurri' }
    ]
  },
  {
    id: 'postres',
    name: 'Postres',
    items: [
      { name: 'Postre 1', description: 'Consulta disponibilidad con tu mesero.', price: 3 },
      { name: 'Postre 2', description: 'Consulta disponibilidad con tu mesero.', price: 3 },
      { name: 'Postre 3', description: 'Consulta disponibilidad con tu mesero.', price: 3 }
    ]
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    items: [
      { name: 'Jugos Naturales', description: 'Mango · Piña · Fresa', price: 2 },
      { name: 'Granizados – Frappes', description: 'Limón · Parchita · Fresa', price: 3 },
      { name: 'Refresco de Lata', price: 2 },
      { name: 'Nestea, Limón o Durazno', price: 2 },
      { name: 'Agua Minalba', price: 1 },
      { name: 'Cerveza', price: 1 },
      { name: 'Soda', price: 1 }
    ]
  }
];
