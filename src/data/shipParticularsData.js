// Ship Particulars Generator & Definitions for PT. Pelayaran Baharimas Kalimantan
// Comprehensive maritime technical specifications for Tugboats (Kapal Tunda) and Barges (Tongkang)

export const createDefaultShipParticulars = (vessel = {}) => {
  const isBarge =
    vessel.type?.toLowerCase().includes('tongkang') ||
    vessel.type?.toLowerCase().includes('barge');

  const isOperator =
    vessel.id?.startsWith('v-op-') ||
    vessel.ownershipStatus === 'As Operator';

  const regNo = vessel.regNo || vessel.imo || '24587';
  const name = vessel.name || 'RP 2020';
  const yearBuilt = vessel.yearBuilt || 2020;
  const builder = vessel.builder || 'PT Dok & Perkapalan Baharimas Pontianak';
  const port = vessel.portOfRegistry || 'Pontianak, Kalimantan Barat';
  const flag = vessel.flag || 'Indonesia (IDN)';
  const callSign = vessel.callSign || (isBarge ? '-' : `YDB${regNo.slice(0, 4)}`);

  // Extract BHP if present in vessel type or name
  let bhp = 3200;
  const bhpMatch = vessel.type?.match(/(\d+)\s*BHP/i);
  if (bhpMatch) {
    bhp = parseInt(bhpMatch[1], 10);
  } else if (name.includes('2012')) {
    bhp = 1800;
  } else if (name.includes('2015') || name.includes('BANDA NEIRA')) {
    bhp = 2600;
  } else if (name.includes('2018')) {
    bhp = 2800;
  } else if (name.includes('2020') || name.includes('2022')) {
    bhp = 3200;
  } else if (name.includes('2024') || name.includes('2026')) {
    bhp = 3400;
  } else if (name.includes('MARIANA') || name.includes('PARIT TOKAYA')) {
    bhp = 2400;
  } else if (name.includes('KUMAI')) {
    bhp = 2200;
  }

  // Barge Feet size (300 ft vs 330 ft)
  const is330Ft = vessel.type?.includes('330') || name.includes('SERIBU') || name.includes('AMBAWANG');

  if (isBarge) {
    const feet = is330Ft ? '330 Feet' : '300 Feet';
    const loa = is330Ft ? '100.58 m (330 Ft)' : '91.44 m (300 Ft)';
    const lbp = is330Ft ? '96.20 m' : '88.20 m';
    const beam = is330Ft ? '27.43 m (90 Ft)' : '24.38 m (80 Ft)';
    const depth = is330Ft ? '6.10 m (20 Ft)' : '5.49 m (18 Ft)';
    const draft = is330Ft ? '4.80 m' : '4.30 m';
    const gt = is330Ft ? 3850 : (vessel.gt || 3250);
    const nt = Math.round(gt * 0.3);
    const dwt = is330Ft ? 8500 : (vessel.dwt || 7500);

    return {
      // 1. Identitas & Legalitas Registrasi
      vesselName: name,
      previousName: '-',
      vesselType: `Tongkang Geladak Baja (Steel Deck Cargo Barge ${feet})`,
      flag: flag,
      portOfRegistry: port,
      officialNo: `${regNo} / Ba.${yearBuilt}`,
      callSign: '-',
      imoNumber: '-',
      mmsi: `5259${regNo.slice(0, 5)}`,
      classification: 'Biro Klasifikasi Indonesia (BKI)',
      classNotation: '+A100 (I) P Tongkang Geladak Baja, +SM',
      builder: builder,
      yearBuilt: yearBuilt,
      keelLaidDate: `${yearBuilt - 1}-06-15`,
      launchingDate: `${yearBuilt - 1}-12-10`,
      deliveryDate: `${yearBuilt}-03-20`,
      ownerCompany: 'PT. Pelayaran Baharimas Kalimantan',
      operatorCompany: isOperator ? 'PT. Pelayaran Baharimas Kalimantan (Charter / Operator)' : 'PT. Pelayaran Baharimas Kalimantan',
      ownershipStatus: isOperator ? 'As Operator' : 'As Owner',

      // 2. Dimensi Utama & Tonase
      lengthOverall: loa,
      lengthBP: lbp,
      breadthMoulded: beam,
      depthMoulded: depth,
      designDraft: draft,
      airDraft: '7.50 m',
      grossTonnage: gt,
      netTonnage: nt,
      deadweight: dwt,
      displacement: `${Math.round(dwt * 1.25)} MT`,
      deckLoadCapacity: is330Ft ? '8.5 Ton/m² Heavy Duty Deck' : '8.0 Ton/m² Heavy Duty Deck',
      sideboardHeight: is330Ft ? '14 Feet (4.25 m)' : '12 Feet (3.65 m)',

      // 3. Permesinan & Daya Geladak
      mainEngine: 'Non-Propelled (Tongkang Ditarik Tugboat)',
      totalHorsepower: 'Non-Propelled (Barge)',
      auxEngine: '1 x Yanmar / Kubota Diesel Generator 15 kVA 220V (Nav Lights & Ballast)',
      gearbox: 'N/A',
      propulsion: 'Non-Propelled (Tongkang Tunda)',
      propellerDiameter: 'N/A',
      steeringGear: 'Fixed Skeg Twin Rudder Fins (Anti-Yaw Skegs)',
      bollardPull: 'N/A',
      maxSpeed: '8.0 Knots (Under Tow)',
      cruisingSpeed: '6.5 Knots (Under Tow)',
      towingSpeed: '5.5 - 6.5 Knots (Loaded)',
      fuelConsumptionCruising: '15 Liter/Hari (Genset Lampu Navigasi)',
      fuelConsumptionTowing: 'N/A',

      // 4. Kapasitas Tangki & Ruang Muat
      fuelOilCapacity: '1,500 Liter (Tangki Harian Genset)',
      freshWaterCapacity: '2,000 Liter',
      lubeOilCapacity: '100 Liter',
      ballastWaterCapacity: is330Ft ? '1,600 m³ (Segregated Ballast Tanks)' : '1,200 m³ (Segregated Ballast Tanks)',
      dirtyOilCapacity: 'N/A',
      sewageHoldingTank: 'N/A',
      cargoCapacityVolume: is330Ft ? '10,500 m³ Bulk Cargo Volume' : '9,000 m³ Bulk Cargo Volume',

      // 5. Perlengkapan Geladak & Penarik
      towingWinch: 'N/A',
      towingWire: 'Bridle Towing Wire Dia 52 mm x 2 Leg (High Strength) + Chafe Chain Grade 3',
      towingHook: 'Smit Towing Brackets & Emergency Towing Fairlead (SWL 100 Ton)',
      windlass: 'Diesel Engine Emergency Anchor Winch (Pull 5.0 Ton)',
      anchors: '1 x Emergency Stockless Bower Anchor 1,500 kg',
      anchorChains: '1 x 150 m Stud Link Anchor Chain 32 mm Grade U2',
      capstan: '2 x Manual Deck Mooring Capstan 5.0 Ton',

      // 6. Navigasi & Komunikasi
      marineRadar: 'Radar Reflector Standard Solas Fitted',
      gpsChartplotter: 'Solar Powered AIS AtoN Transponder & GPS Beacon (Live Position)',
      echoSounder: 'N/A',
      magneticCompass: 'N/A',
      ais: 'AIS Class B AtoN Solar Transponder Unit',
      vhfRadio: '2 x Handheld Waterproof Marine VHF Radio (Mooring Ops)',
      ssbRadio: 'N/A',
      epirb: 'N/A',
      sart: 'N/A',

      // 7. Keselamatan & Perlindungan Geladak
      lifeRaft: '1 x Inflatable Life Raft 6 Persons (For Mooring / Inspection Crew)',
      lifeBuoy: '4 x SOLAS Approved Ring Lifebuoys with Lifeline',
      lifeJacket: '6 x SOLAS Standard Work Vests & Life Jackets',
      fireFightingExternal: 'Portable Diesel Fire & Bilge Pump 30 m³/hr',
      firePump: 'Portable Centrifugal Fire Pump 6.5 HP',
      engineRoomFireExt: '2 x 9 kg Dry Chemical Powder (DCP) on Gen Enclosure',
      portableExtinguishers: '4 x 9 kg Dry Chemical Powder (DCP) Heavy Duty Outdoor',

      // 8. Akomodasi & Catatan Teknis
      crewComplement: 'Unmanned (Tanpa Awak Tetap Saat Berlayar)',
      cabins: '1 x Watchmen / Line Handler Shelter Cabin on Aft Deck',
      airConditioning: 'N/A',
      specialNotes: `Tongkang batubara baja ${feet} berkonstruksi kokoh dengan dinding penahan muatan (sideboard) heavy duty. Dilengkapi skeg anti-yaw untuk stabilitas saat ditarik di alur sungai sempit maupun laut lepas.`
    };
  }

  // TUGBOAT PARTICULARS
  const halfBhp = Math.round(bhp / 2);
  const singleScrew = vessel.type?.toLowerCase().includes('single');
  const engineModel =
    bhp >= 3200
      ? 'Yanmar 6EY17W Marine Diesel'
      : bhp >= 2600
      ? 'Mitsubishi S6R2-MTK3L Marine Diesel'
      : bhp >= 2400
      ? 'Cummins KTA38-M0 Marine Diesel'
      : bhp >= 2000
      ? 'Yanmar 6AYM-WET Marine Diesel'
      : 'Hanshin / Niigata Marine Diesel';

  const bollardTons = Math.round(bhp / 80);
  const loaM = (22 + (bhp / 3400) * 8.5).toFixed(2);
  const lbpM = (parseFloat(loaM) - 2.5).toFixed(2);
  const beamM = (7.0 + (bhp / 3400) * 2.2).toFixed(2);
  const depthM = (3.4 + (bhp / 3400) * 1.2).toFixed(2);
  const draftM = (2.4 + (bhp / 3400) * 0.9).toFixed(2);
  const fuelCap = Math.round(100 + (bhp / 3400) * 90) * 1000;
  const waterCap = Math.round(30 + (bhp / 3400) * 20) * 1000;

  return {
    // 1. Identitas & Legalitas Registrasi
    vesselName: name,
    previousName: '-',
    vesselType: vessel.type || `Tugboat (Kapal Tunda Twin Screw ${bhp} BHP)`,
    flag: flag,
    portOfRegistry: port,
    officialNo: `${regNo} / Ba.${yearBuilt}`,
    callSign: callSign,
    imoNumber: vessel.imo || regNo,
    mmsi: `5250${regNo.padEnd(5, '0').slice(0, 5)}`,
    classification: 'Biro Klasifikasi Indonesia (BKI)',
    classNotation: singleScrew ? '+A100 (I) P Kapal Tunda, +SM' : '+A100 (I) P Kapal Tunda Twin Screw, +SM',
    builder: builder,
    yearBuilt: yearBuilt,
    keelLaidDate: `${yearBuilt - 1}-04-10`,
    launchingDate: `${yearBuilt - 1}-10-25`,
    deliveryDate: `${yearBuilt}-02-18`,
    ownerCompany: 'PT. Pelayaran Baharimas Kalimantan',
    operatorCompany: isOperator ? 'PT. Pelayaran Baharimas Kalimantan (Charter / Operator)' : 'PT. Pelayaran Baharimas Kalimantan',
    ownershipStatus: isOperator ? 'As Operator' : 'As Owner',

    // 2. Dimensi Utama & Tonase
    lengthOverall: `${loaM} m`,
    lengthBP: `${lbpM} m`,
    breadthMoulded: `${beamM} m`,
    depthMoulded: `${depthM} m`,
    designDraft: `${draftM} m`,
    airDraft: '14.50 m',
    grossTonnage: vessel.gt || Math.round(200 + (bhp / 3400) * 130),
    netTonnage: Math.round((vessel.gt || 310) * 0.3),
    deadweight: vessel.dwt || Math.round(300 + (bhp / 3400) * 180),
    displacement: `${Math.round((vessel.dwt || 450) * 1.55)} MT`,
    deckLoadCapacity: '5.0 Ton/m²',
    sideboardHeight: 'N/A (Tugboat)',

    // 3. Permesinan & Penggerak Utama
    mainEngine: singleScrew
      ? `1 x ${engineModel} (${bhp} BHP)`
      : `2 x ${engineModel} (@ ${halfBhp} BHP)`,
    totalHorsepower: `${bhp} BHP (${singleScrew ? '1' : '2'} x ${singleScrew ? bhp : halfBhp} HP @ 1800 RPM)`,
    auxEngine: '2 x Cummins 6BT5.9 / Stamford Generator 50 kVA 380V / 220V 50Hz',
    gearbox: singleScrew
      ? '1 x Reintjes / Advance D300A Ratio 5.0:1'
      : '2 x Reintjes WAF 665 / Advance Ratio 5.95:1',
    propulsion: singleScrew
      ? 'Single Screw 4-Bladed Fixed Pitch Manganese Bronze in Kort Nozzle'
      : 'Twin Screw 4-Bladed Fixed Pitch Manganese Bronze in Kort Nozzles',
    propellerDiameter: '2,050 mm',
    steeringGear: 'Electro-Hydraulic Steering Gear 2 x Ram 5.0 kNm with Emergency Hand Pump',
    bollardPull: `${bollardTons} Tonnes (Certified Bollard Pull)`,
    maxSpeed: `${(10.5 + (bhp / 3400) * 1.5).toFixed(1)} Knots`,
    cruisingSpeed: `${(7.5 + (bhp / 3400) * 1.2).toFixed(1)} Knots`,
    towingSpeed: '5.5 - 6.5 Knots (With Loaded 300ft Barge)',
    fuelConsumptionCruising: `${Math.round(110 + (bhp / 3400) * 60)} Liter/Jam (Combined)`,
    fuelConsumptionTowing: `${Math.round(150 + (bhp / 3400) * 80)} Liter/Jam (Combined)`,

    // 4. Kapasitas Tangki & Ruang Muat
    fuelOilCapacity: `${fuelCap.toLocaleString('id-ID')} Liter (${(fuelCap / 1000).toFixed(0)} m³)`,
    freshWaterCapacity: `${waterCap.toLocaleString('id-ID')} Liter (${(waterCap / 1000).toFixed(0)} m³)`,
    lubeOilCapacity: '2,400 Liter',
    ballastWaterCapacity: '45 m³',
    dirtyOilCapacity: '3,000 Liter',
    sewageHoldingTank: '2,500 Liter',
    cargoCapacityVolume: 'N/A (Tugboat Penarik)',

    // 5. Perlengkapan Geladak & Penarik
    towingWinch: `Electro-Hydraulic Towing Winch Single Drum (Line Pull ${bollardTons} T, Brake ${bollardTons * 2} T)`,
    towingWire: 'Dia 48 mm x 650 m Galvanized Extra High Strength Steel Wire Rope',
    towingHook: `Quick Release Disc Type Towing Hook ${bollardTons + 10} Tonnes SWL`,
    windlass: 'Electro-Hydraulic Anchor Windlass with Double Gypsy & Warping Drum',
    anchors: '2 x Stockless Bower Anchor @ 570 kg each',
    anchorChains: '2 x 220 m Grade U2 Stud Link Chain 19 mm',
    capstan: 'Electro-Hydraulic Capstan 3.0 Tonnes',

    // 6. Navigasi & Komunikasi
    marineRadar: 'Furuno Marine Radar 1835 (24 NM) & Radar Koden MDC-941',
    gpsChartplotter: 'Furuno GP-39 Color GPS Navigator & AIS Plotter',
    echoSounder: 'Furuno FE-700 Marine Echo Sounder 200 kHz',
    magneticCompass: 'Daiko Keiki T-150B Tabletop Magnetic Compass',
    ais: 'Furuno FA-170 Class A AIS Transponder with GPS Antenna',
    vhfRadio: '2 x ICOM IC-M330 Marine VHF Transceiver (DSC Ch. 70)',
    ssbRadio: 'Furuno FS-1503 HF/SSB 150W Radio Telephony',
    epirb: 'McMurdo SmartFind G8 AIS EPIRB 406 MHz (Cospas-Sarsat)',
    sart: 'McMurdo S4 Rescue Radar SART 9 GHz',

    // 7. Keselamatan & Pemadam (SOLAS / FiFi)
    lifeRaft: '2 x Inflatable Life Rafts @ 10 Persons SOLAS Compliant',
    lifeBuoy: '8 x Life Buoys with SI-Light & 30m Lifeline',
    lifeJacket: '16 x SOLAS Standard Life Jackets with Whistle & Strobe Light',
    fireFightingExternal: 'FiFi 1/2 Monitor 600 m³/hr with Water Spray Throw 45m',
    firePump: 'Centrifugal Fire Pump 25 m³/hr @ 6 Bar Driven by Aux Engine',
    engineRoomFireExt: 'Fixed CO2 Fire Extinguishing System (Total Flooding Engine Room)',
    portableExtinguishers: '6 x 9 kg Dry Chemical Powder (DCP) + 2 x 45L Foam Trolley + 2 x 5 kg CO2',

    // 8. Akomodasi & Catatan Teknis
    crewComplement: '10 - 12 Orang (Nakhoda, Perwira & ABK)',
    cabins: '1 x Captain Cabin, 1 x Chief Engineer Cabin, 4 x Officer/Crew Double Berths',
    airConditioning: 'Fully Air Conditioned Berths, Galley & Mess Room',
    specialNotes: `Kapal tunda niaga bersertifikasi BKI laik laut, dioperasikan secara profesional untuk penarikan tongkang batubara & bauksit 300ft/330ft di perairan Sungai Kapuas, Muara Jungkat, Pontianak, Ketapang - Kendawangan Kalimantan Barat, hingga lintas kepulauan Indonesia.`
  };
};

export const PARTICULAR_SECTIONS = [
  {
    id: 'general',
    title: 'Identitas & Registrasi',
    subtitle: 'Data legalitas, klasifikasi BKI, dan kepemilikan',
    icon: 'Ship',
    fields: [
      { key: 'vesselName', label: 'Nama Kapal', type: 'text', required: true },
      { key: 'previousName', label: 'Nama Sebelumnya', type: 'text' },
      { key: 'vesselType', label: 'Tipe / Jenis Kapal', type: 'text', required: true },
      { key: 'flag', label: 'Bendera Kebangsaan', type: 'text', required: true },
      { key: 'portOfRegistry', label: 'Pelabuhan Pendaftaran', type: 'text', required: true },
      { key: 'officialNo', label: 'No. Registrasi / Akta', type: 'text', required: true },
      { key: 'callSign', label: 'Tanda Panggilan (Call Sign)', type: 'text' },
      { key: 'imoNumber', label: 'Nomor IMO', type: 'text' },
      { key: 'mmsi', label: 'Nomor MMSI', type: 'text' },
      { key: 'classification', label: 'Badan Klasifikasi', type: 'text', required: true },
      { key: 'classNotation', label: 'Notasi Klas BKI', type: 'text' },
      { key: 'builder', label: 'Galangan Pembuat (Shipyard)', type: 'text' },
      { key: 'yearBuilt', label: 'Tahun Pembuatan', type: 'number' },
      { key: 'keelLaidDate', label: 'Tanggal Peletakan Lunas', type: 'date' },
      { key: 'launchingDate', label: 'Tanggal Peluncuran', type: 'date' },
      { key: 'deliveryDate', label: 'Tanggal Selesai / Serah Terima', type: 'date' },
      { key: 'ownerCompany', label: 'Perusahaan Pemilik (Owner)', type: 'text' },
      { key: 'operatorCompany', label: 'Perusahaan Pengoperasi (Operator)', type: 'text' },
      { key: 'ownershipStatus', label: 'Status Hubungan (Owner/Operator)', type: 'select', options: ['As Owner', 'As Operator', 'As Owner & Operator'] }
    ]
  },
  {
    id: 'dimensions',
    title: 'Dimensi Utama & Tonase',
    subtitle: 'Panjang, lebar, sarat air, dan ukuran tonase kapal',
    icon: 'Maximize2',
    fields: [
      { key: 'lengthOverall', label: 'Panjang Keseluruhan (LOA)', type: 'text', unit: 'm / ft' },
      { key: 'lengthBP', label: 'Panjang Antara Garis Tegak (LBP)', type: 'text', unit: 'm' },
      { key: 'breadthMoulded', label: 'Lebar Moulded (Beam)', type: 'text', unit: 'm / ft' },
      { key: 'depthMoulded', label: 'Tinggi Geladak (Depth)', type: 'text', unit: 'm / ft' },
      { key: 'designDraft', label: 'Sarat Air Maksimum (Draft)', type: 'text', unit: 'm' },
      { key: 'airDraft', label: 'Air Draft (Tinggi Tiang)', type: 'text', unit: 'm' },
      { key: 'grossTonnage', label: 'Tonase Kotor (GT)', type: 'number', unit: 'GT' },
      { key: 'netTonnage', label: 'Tonase Bersih (NT)', type: 'number', unit: 'NT' },
      { key: 'deadweight', label: 'Bobot Mati (DWT)', type: 'number', unit: 'DWT' },
      { key: 'displacement', label: 'Displacement (Bobot Benaman)', type: 'text', unit: 'MT' },
      { key: 'deckLoadCapacity', label: 'Kekuatan Geladak (Deck Load)', type: 'text' },
      { key: 'sideboardHeight', label: 'Tinggi Dinding Muatan (Sideboard)', type: 'text' }
    ]
  },
  {
    id: 'machinery',
    title: 'Permesinan & Penggerak',
    subtitle: 'Spesifikasi mesin induk, genset, propeller, dan kecepatan',
    icon: 'Cpu',
    fields: [
      { key: 'mainEngine', label: 'Mesin Induk (Main Engine)', type: 'text' },
      { key: 'totalHorsepower', label: 'Total Daya Mesin (BHP / RPM)', type: 'text' },
      { key: 'auxEngine', label: 'Mesin Bantu / Genset (Aux Engine)', type: 'text' },
      { key: 'gearbox', label: 'Kotak Roda Gigi (Gearbox & Ratio)', type: 'text' },
      { key: 'propulsion', label: 'Sistem Propulsi / Baling-Baling', type: 'text' },
      { key: 'propellerDiameter', label: 'Diameter Propeller', type: 'text' },
      { key: 'steeringGear', label: 'Mesin Kemudi (Steering Gear)', type: 'text' },
      { key: 'bollardPull', label: 'Kekuatan Tarik Tunda (Bollard Pull)', type: 'text', unit: 'Tons' },
      { key: 'maxSpeed', label: 'Kecepatan Maksimum Bebas', type: 'text', unit: 'Knots' },
      { key: 'cruisingSpeed', label: 'Kecepatan Jelajah Ekonomis', type: 'text', unit: 'Knots' },
      { key: 'towingSpeed', label: 'Kecepatan Menunda Tongkang', type: 'text', unit: 'Knots' },
      { key: 'fuelConsumptionCruising', label: 'Konsumsi BBM Jelajah Bebas', type: 'text' },
      { key: 'fuelConsumptionTowing', label: 'Konsumsi BBM Saat Menunda', type: 'text' }
    ]
  },
  {
    id: 'tanks',
    title: 'Kapasitas Tangki & Muatan',
    subtitle: 'Kapasitas BBM, air tawar, pelumas, dan ballas',
    icon: 'Fuel',
    fields: [
      { key: 'fuelOilCapacity', label: 'Kapasitas BBM (Fuel Oil / Solar)', type: 'text' },
      { key: 'freshWaterCapacity', label: 'Kapasitas Air Tawar (Fresh Water)', type: 'text' },
      { key: 'lubeOilCapacity', label: 'Kapasitas Minyak Pelumas (Lube Oil)', type: 'text' },
      { key: 'ballastWaterCapacity', label: 'Kapasitas Air Ballas (Ballast Water)', type: 'text' },
      { key: 'dirtyOilCapacity', label: 'Tangki Minyak Kotor / Sludge', type: 'text' },
      { key: 'sewageHoldingTank', label: 'Tangki Penampung Sewage Limbah', type: 'text' },
      { key: 'cargoCapacityVolume', label: 'Volume Ruang Muat / Cargo Volume', type: 'text' }
    ]
  },
  {
    id: 'deck',
    title: 'Peralatan Geladak & Penarik',
    subtitle: 'Derek tunda, tali penarik, jangkar, dan perlengkapan mooring',
    icon: 'Anchor',
    fields: [
      { key: 'towingWinch', label: 'Derek Penarik (Towing Winch)', type: 'text' },
      { key: 'towingWire', label: 'Tali Baja Penarik (Towing Wire)', type: 'text' },
      { key: 'towingHook', label: 'Kait Tunda (Towing Hook)', type: 'text' },
      { key: 'windlass', label: 'Mesin Jangkar (Anchor Windlass)', type: 'text' },
      { key: 'anchors', label: 'Jangkar (Bower Anchors)', type: 'text' },
      { key: 'anchorChains', label: 'Rantai Jangkar (Anchor Chains)', type: 'text' },
      { key: 'capstan', label: 'Derek Tali Tambat (Capstan)', type: 'text' }
    ]
  },
  {
    id: 'navigation',
    title: 'Navigasi & Komunikasi',
    subtitle: 'Radar, GPS, AIS, radio VHF/SSB, dan alat keselamatan maritim',
    icon: 'Radio',
    fields: [
      { key: 'marineRadar', label: 'Radar Maritim (Marine Radar)', type: 'text' },
      { key: 'gpsChartplotter', label: 'GPS Navigator & Chartplotter', type: 'text' },
      { key: 'echoSounder', label: 'Alat Pengukur Kedalaman (Echo Sounder)', type: 'text' },
      { key: 'magneticCompass', label: 'Kompas Magnetik / Gyro Compass', type: 'text' },
      { key: 'ais', label: 'Sistem Identifikasi Otomatis (AIS)', type: 'text' },
      { key: 'vhfRadio', label: 'Radio Komunikasi VHF Laut', type: 'text' },
      { key: 'ssbRadio', label: 'Radio HF / SSB Jarak Jauh', type: 'text' },
      { key: 'epirb', label: 'EPIRB Darurat (Emergency Beacon)', type: 'text' },
      { key: 'sart', label: 'Radar Transponder SART', type: 'text' }
    ]
  },
  {
    id: 'safety',
    title: 'Keselamatan & Pemadam (SOLAS)',
    subtitle: 'Inflatable liferaft, pelampung, pemadam eksternal FiFi, dan APAR',
    icon: 'Shield',
    fields: [
      { key: 'lifeRaft', label: 'Sekoci Karet Penolong (Life Rafts)', type: 'text' },
      { key: 'lifeBuoy', label: 'Pelampung Penolong (Life Buoys)', type: 'text' },
      { key: 'lifeJacket', label: 'Rompi Penolong (Life Jackets)', type: 'text' },
      { key: 'fireFightingExternal', label: 'Pemadam Eksternal (FiFi Monitor)', type: 'text' },
      { key: 'firePump', label: 'Pompa Pemadam Kebakaran Utama', type: 'text' },
      { key: 'engineRoomFireExt', label: 'Sistem Pemadam Kamar Mesin (CO2)', type: 'text' },
      { key: 'portableExtinguishers', label: 'Tabung Pemadam Api Portabel (APAR)', type: 'text' }
    ]
  },
  {
    id: 'accommodation',
    title: 'Akomodasi & Catatan Teknis',
    subtitle: 'Kapasitas awak, ruangan kabin, dan catatan operasional khusus',
    icon: 'Users',
    fields: [
      { key: 'crewComplement', label: 'Kapasitas Awak Maksimum (Complement)', type: 'text' },
      { key: 'cabins', label: 'Susunan Kamar / Kabin Awak', type: 'text' },
      { key: 'airConditioning', label: 'Sistem Pendingin Ruangan (AC)', type: 'text' },
      { key: 'specialNotes', label: 'Catatan Teknis / Kelaiklautan Khusus', type: 'textarea' }
    ]
  }
];
