import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const generateMockData = () => {
    // Base date for today
    const today = new Date();
    // We'll use a fixed "demo time" of 10:30 AM for relative calculations
    const demoTime = new Date(today);
    demoTime.setHours(10, 30, 0, 0);

    const getDateWithTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date(today);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    // Helper to generate a realistic check-in time (e.g., 5-15 mins before or after scheduled)
    const getRealisticCheckIn = (scheduledTimeStr, delayMins = 0) => {
        const scheduled = getDateWithTime(scheduledTimeStr);
        // If delayMins is positive, they arrived late. If negative, they arrived early.
        return new Date(scheduled.getTime() + delayMins * 60 * 1000).toISOString();
    };

    // Total scheduled appointments (non-available): 16
    // To get 60% confirmation: 16 * 0.6 = 9.6 -> 10 confirmed.

    // Existing Appointments
    const appointments = [
        // Dr. Smith Schedule (08:00 - 10:00) - Room 101
        {
            id: 200,
            time: "08:00",
            patientName: "Laura Gomez",
            dni: "38.123.456",
            birthDate: "12/08/1994",
            doctorName: "Dr. Smith",
            room: "101",
            status: "waiting",
            checkInTime: getRealisticCheckIn("08:00", -8), // Arrived 07:52
            waitTime: 10,
            medicalHistorySummary: "Paciente cursando embarazo de 12 semanas. Náuseas leves.",
            age: 31,
            gender: "Femenino",
            bloodType: "A+",
            lastVisit: "15 Ene 2026",
            reasonForVisit: "Control obstétrico.",
            chronicConditions: [],
            medications: ["Ácido Fólico"],
            riskFactors: [],
            confirmed: true,
        },
        {
            id: 101,
            time: "08:30",
            patientName: "Lucia Diaz",
            dni: "89.012.345",
            birthDate: "25/03/2000",
            doctorName: "Dr. Smith",
            room: "101",
            status: "absent",
            checkInTime: null,
            waitTime: 0,
            medicalHistorySummary: "Asma bronquial leve.",
            age: 25,
            gender: "Femenino",
            bloodType: "B+",
            lastVisit: "10 Ago 2025",
            reasonForVisit: "Control anual asma.",
            chronicConditions: ["Asma Bronquial"],
            medications: ["Salbutamol"],
            riskFactors: [],
            confirmed: true, // 1
        },
        {
            id: 1,
            time: "09:00",
            patientName: "Juan Perez",
            dni: "12.345.678",
            birthDate: "15/05/1980",
            doctorName: "Dr. Smith",
            room: "101",
            status: "finished",
            checkInTime: getRealisticCheckIn("09:00", -12), // Arrived 08:48
            waitTime: 0,
            medicalHistorySummary: "Paciente hipertenso controlado.",
            age: 45,
            gender: "Masculino",
            bloodType: "O+",
            lastVisit: "10 Nov 2025",
            reasonForVisit: "Control PA.",
            chronicConditions: ["Hipertensión"],
            medications: ["Enalapril"],
            riskFactors: [],
            confirmed: true, // 2
        },
        {
            id: 12,
            time: "09:15",
            patientName: "Pedro Pascal",
            dni: "99.111.222",
            birthDate: "02/04/1975",
            doctorName: "Dr. Smith",
            room: "101",
            status: "waiting",
            checkInTime: getRealisticCheckIn("09:15", 5), // Arrived 09:20 (Late)
            waitTime: 10,
            medicalHistorySummary: "Dolor de espalda.",
            age: 48,
            gender: "Masculino",
            bloodType: "A+",
            lastVisit: "N/A",
            reasonForVisit: "Lumbago.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: true, // 3
        },
        {
            id: 2,
            time: "09:30",
            patientName: "Maria Lopez",
            dni: "23.456.789",
            birthDate: "22/11/1962",
            doctorName: "Dr. Smith",
            room: "101",
            status: "consulting",
            checkInTime: getRealisticCheckIn("09:30", -8), // Arrived 09:22
            waitTime: 20,
            medicalHistorySummary: "Diabetes Tipo 2.",
            age: 62,
            gender: "Femenino",
            bloodType: "A+",
            lastVisit: "20 Dic 2025",
            reasonForVisit: "Control DM.",
            chronicConditions: ["Diabetes"],
            medications: ["Metformina"],
            riskFactors: [],
            confirmed: true, // 4
        },
        {
            id: 13,
            time: "09:45",
            patientName: "Diego Luna",
            dni: "88.222.333",
            birthDate: "29/12/1979",
            doctorName: "Dr. Smith",
            room: "101",
            status: "waiting",
            checkInTime: getRealisticCheckIn("09:45", -5), // Arrived 09:40
            waitTime: 5,
            medicalHistorySummary: "Alergia estacional.",
            age: 44,
            gender: "Masculino",
            bloodType: "O-",
            lastVisit: "10 Sep 2024",
            reasonForVisit: "Rinitis.",
            chronicConditions: [],
            medications: ["Loratadina"],
            riskFactors: [],
            confirmed: false,
        },

        // Dr. Caputo Schedule (10:00 - 12:00) - Room 101 (Shared)
        {
            id: 4,
            time: "10:00",
            patientName: "Carlos Ruiz",
            dni: "45.678.901",
            birthDate: "05/08/1988",
            doctorName: "Dr. Caputo",
            room: "101",
            status: "waiting",
            checkInTime: getRealisticCheckIn("10:00", -15), // Arrived 09:45
            waitTime: 45,
            medicalHistorySummary: "Lumbago.",
            age: 37,
            gender: "Masculino",
            bloodType: "A+",
            lastVisit: "15 Oct 2025",
            reasonForVisit: "Dolor lumbar.",
            chronicConditions: ["Lumbago"],
            medications: ["Diclofenaco"],
            riskFactors: [],
            confirmed: true, // 5
        },
        {
            id: 5,
            time: "10:15",
            patientName: "Ana Silva",
            dni: "56.789.012",
            birthDate: "30/01/1995",
            doctorName: "Dr. Caputo",
            room: "101",
            status: "waiting",
            checkInTime: getRealisticCheckIn("10:15", 10), // Arrived 10:25
            waitTime: 5,
            medicalHistorySummary: "Chequeo.",
            age: 30,
            gender: "Femenino",
            bloodType: "O+",
            lastVisit: "12 Feb 2025",
            reasonForVisit: "Chequeo general.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: true, // 6
        },
        {
            id: 6,
            time: "10:30",
            patientName: "Pedro Gomez",
            dni: "67.890.123",
            birthDate: "12/12/1960",
            doctorName: "Dr. Caputo",
            room: "101",
            status: "scheduled",
            checkInTime: null,
            waitTime: 0,
            medicalHistorySummary: "Post-op apéndice.",
            age: 65,
            gender: "Masculino",
            bloodType: "AB+",
            lastVisit: "28 Dic 2025",
            reasonForVisit: "Retiro puntos.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: false,
        },
        {
            id: 10,
            time: "11:30",
            patientName: "Laura Mendez",
            dni: "33.444.555",
            birthDate: "10/10/1992",
            doctorName: "Dr. Caputo",
            room: "101",
            status: "scheduled",
            checkInTime: null,
            waitTime: 0,
            medicalHistorySummary: "Control dermatológico.",
            age: 33,
            gender: "Femenino",
            bloodType: "A+",
            lastVisit: "01 Feb 2025",
            reasonForVisit: "Revisión lunares.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: true, // 7
        },
        {
            id: 11,
            time: "11:45",
            patientName: "Mario Bros",
            dni: "11.111.111",
            birthDate: "10/10/1980",
            doctorName: "Dr. Caputo",
            room: "101",
            status: "scheduled",
            checkInTime: null,
            waitTime: 0,
            medicalHistorySummary: "Dolor rodilla.",
            age: 45,
            gender: "Masculino",
            bloodType: "O-",
            lastVisit: "N/A",
            reasonForVisit: "Dolor al saltar.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: false,
        },

        // Dra. Garcia Schedule (09:00 - 12:00) - Room 205
        {
            id: 201,
            time: "09:00",
            patientName: "Elena Torres",
            dni: "11.222.333",
            birthDate: "10/10/1990",
            doctorName: "Dra. Garcia",
            room: "205",
            status: "finished",
            checkInTime: getRealisticCheckIn("09:00", -5),
            waitTime: 0,
            medicalHistorySummary: "Esguince tobillo.",
            age: 35,
            gender: "Femenino",
            bloodType: "O+",
            lastVisit: "01 Ene 2026",
            reasonForVisit: "Control.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: true, // 8
        },
        {
            id: 3,
            time: "09:45",
            patientName: "Roberto Gomez",
            dni: "34.567.890",
            birthDate: "10/02/1975",
            doctorName: "Dra. Garcia",
            room: "205",
            status: "waiting",
            checkInTime: getRealisticCheckIn("09:45", 15), // Arrived 10:00 (Late)
            waitTime: 30,
            medicalHistorySummary: "Fractura tibia.",
            age: 50,
            gender: "Masculino",
            bloodType: "B-",
            lastVisit: "05 Ene 2026",
            reasonForVisit: "Retiro yeso.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: false,
        },
        {
            id: 202,
            time: "10:15",
            patientName: "Sofia Ramirez",
            dni: "44.555.666",
            birthDate: "05/05/1985",
            doctorName: "Dra. Garcia",
            room: "205",
            status: "scheduled",
            checkInTime: null,
            waitTime: 0,
            medicalHistorySummary: "Artritis.",
            age: 40,
            gender: "Femenino",
            bloodType: "A-",
            lastVisit: "N/A",
            reasonForVisit: "Primera consulta.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: true, // 9
        },

        // Dr. House Schedule (10:00 - 13:00) - Room 303
        {
            id: 301,
            time: "10:00",
            patientName: "Jorge Martinez",
            dni: "99.888.777",
            birthDate: "20/01/1970",
            doctorName: "Dr. House",
            room: "303",
            status: "waiting",
            checkInTime: getRealisticCheckIn("10:00", -10),
            waitTime: 40,
            medicalHistorySummary: "Migraña.",
            age: 56,
            gender: "Masculino",
            bloodType: "AB-",
            lastVisit: "15 Dic 2025",
            reasonForVisit: "Control.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: true, // 10
        },
        {
            id: 302,
            time: "10:30",
            patientName: "Valeria Lopez",
            dni: "77.666.555",
            birthDate: "14/02/1998",
            doctorName: "Dr. House",
            room: "303",
            status: "consulting",
            checkInTime: getRealisticCheckIn("10:30", -5),
            waitTime: 5,
            medicalHistorySummary: "Fatiga.",
            age: 27,
            gender: "Femenino",
            bloodType: "O+",
            lastVisit: "10 Ene 2026",
            reasonForVisit: "Estudio.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: false,
        },
        {
            id: 9,
            time: "11:15",
            patientName: "Miguel Angel",
            dni: "90.123.456",
            birthDate: "14/07/1955",
            doctorName: "Dr. House",
            room: "303",
            status: "scheduled",
            checkInTime: null,
            waitTime: 0,
            medicalHistorySummary: "Dolor abdominal.",
            age: 70,
            gender: "Masculino",
            bloodType: "O-",
            lastVisit: "02 Ene 2026",
            reasonForVisit: "Control.",
            chronicConditions: [],
            medications: [],
            riskFactors: [],
            confirmed: false,
        },
    ];

    // Define Shifts: Doctor, Room, StartHour, EndHour (Exclusive)
    const shifts = [
        { doctor: "Dr. Smith", room: "101", start: "08:00", end: "10:00" },
        { doctor: "Dr. Caputo", room: "101", start: "10:00", end: "12:00" },
        { doctor: "Dra. Garcia", room: "205", start: "09:00", end: "12:00" },
        { doctor: "Dr. House", room: "303", start: "10:00", end: "13:00" },
    ];

    // Helper to generate time slots
    const generateSlots = (startStr, endStr) => {
        const slots = [];
        let [startH, startM] = startStr.split(':').map(Number);
        let [endH, endM] = endStr.split(':').map(Number);

        let currentH = startH;
        let currentM = startM;

        while (currentH < endH || (currentH === endH && currentM < endM)) {
            const timeStr = `${currentH.toString().padStart(2, '0')}:${currentM.toString().padStart(2, '0')}`;
            slots.push(timeStr);

            currentM += 15;
            if (currentM >= 60) {
                currentH++;
                currentM = 0;
            }
        }
        return slots;
    };

    // Fill gaps
    let finalAppointments = [...appointments];
    let nextId = 1000;

    shifts.forEach(shift => {
        const slots = generateSlots(shift.start, shift.end);
        slots.forEach(time => {
            const exists = finalAppointments.find(app => app.doctorName === shift.doctor && app.time === time);
            if (!exists) {
                finalAppointments.push({
                    id: nextId++,
                    time: time,
                    patientName: "",
                    dni: "",
                    birthDate: "",
                    doctorName: shift.doctor,
                    room: shift.room,
                    status: "available",
                    checkInTime: null,
                    waitTime: 0,
                    medicalHistorySummary: "",
                    age: null,
                    gender: "",
                    bloodType: "",
                    lastVisit: "",
                    reasonForVisit: "",
                    chronicConditions: [],
                    medications: [],
                    riskFactors: [],
                    confirmed: false, // Available slots are not confirmed
                });
            }
        });
    });
    const insurances = ["OSDE 310", "Swiss Medical", "Medicus", "PAMI", "Particular", "Galeno", "Sancor Salud"];
    const finalWithInsurance = finalAppointments.map((app) => {
        if (app.patientName) {
            const charSum = app.patientName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const insuranceIdx = charSum % insurances.length;
            return {
                ...app,
                insurance: insurances[insuranceIdx]
            };
        }
        return app;
    });

    return finalWithInsurance.sort((a, b) => a.time.localeCompare(b.time));
};
