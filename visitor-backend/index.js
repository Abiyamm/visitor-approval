require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// --- AUTHENTICATION ROUTES ---

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role || 'EMPLOYEE',
        department: department || 'General',
      },
    });

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// --- HOST / EMPLOYEE DIRECTORY ROUTE ---
app.get('/api/hosts', async (req, res) => {
  try {
    const hosts = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: { id: true, name: true, email: true, department: true },
      orderBy: { name: 'asc' },
    });
    res.status(200).json(hosts);
  } catch (error) {
    console.error('Error fetching hosts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- VISITOR MANAGEMENT ROUTES ---

// 1. Submit a Guest Visit Request
app.post('/api/visits', async (req, res) => {
  try {
    const { 
      guestName, 
      guestEmail, 
      password, 
      guestPhone, 
      hasLaptop, 
      company, 
      purpose, 
      hostId 
    } = req.body;

    let host = null;
    if (hostId && hostId.trim() !== '') {
      host = await prisma.user.findUnique({ where: { id: hostId } });
      if (!host) {
        return res.status(404).json({ error: 'Host employee not found.' });
      }
    }

    const newVisit = await prisma.visitRequest.create({
      data: {
        guestName,
        guestEmail,
        password: password || '123456',
        guestPhone,
        hasLaptop: Boolean(hasLaptop), // True if with laptop, false otherwise
        company: company || 'Independent',
        purpose,
        hostId: hostId && hostId.trim() !== '' ? hostId : null,
        status: 'PENDING',
      },
    });

    res.status(201).json({ 
      message: 'Visit request submitted successfully. Pending security approval.', 
      newVisit 
    });
  } catch (error) {
    console.error('Error creating visit request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Get Pending Visits for Security Review
app.get('/api/security/pending', async (req, res) => {
  try {
    const pendingVisits = await prisma.visitRequest.findMany({
      where: { status: 'PENDING' },
      include: { host: { select: { name: true, email: true, department: true } } },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(pendingVisits);
  } catch (error) {
    console.error('Error fetching pending visits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Security Review: Approve or Deny a Visit Request
app.patch('/api/security/visits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, securityNotes } = req.body;

    if (!['APPROVED', 'DENIED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be APPROVED or DENIED.' });
    }

    const updatedVisit = await prisma.visitRequest.update({
      where: { id },
      data: {
        status,
        securityNotes: securityNotes || null,
      },
    });

    res.status(200).json({ 
      message: `Visit request has been ${status.toLowerCase()}.`, 
      updatedVisit 
    });
  } catch (error) {
    console.error('Error updating visit status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Get Visits for a Specific Employee/Host (Includes assigned visits + unassigned/walk-ins)
app.get('/api/hosts/:hostId/visits', async (req, res) => {
  try {
    const { hostId } = req.params;

    const visits = await prisma.visitRequest.findMany({
      where: {
        OR: [
          { hostId: hostId }, // Visits explicitly assigned to this employee
          { hostId: null }    // Walk-ins or unassigned general visits from Security Dashboard
        ]
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(visits);
  } catch (error) {
    console.error('Error fetching host visits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});