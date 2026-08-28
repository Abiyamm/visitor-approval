const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// POST route to register a new visit (Walk-In or regular request)
app.post('/api/visits', async (req, res) => {
  try {
    const { guestName, guestEmail, password, guestPhone, hasLaptop, company, purpose, hostId } = req.body;

    let host = null;
    
    // Only check for a host if hostId is a valid, non-empty string
    if (hostId && hostId.trim() !== '') {
      host = await prisma.user.findUnique({ where: { id: hostId } });
      if (!host) {
        return res.status(404).json({ error: 'Host employee not found in database.' });
      }
    }

    // Create the new visit request in the database
    const newVisit = await prisma.visitRequest.create({
      data: {
        guestName,
        guestEmail,
        password: password || '', 
        guestPhone: guestPhone || '',
        hasLaptop: hasLaptop ?? false,
        company,
        purpose,
        hostId: hostId && hostId.trim() !== '' ? hostId : null, // Safely handle empty strings as null
        status: 'PENDING' // Defaults to pending security approval
      },
      include: {
        host: true // Returns host details if a host exists, or null otherwise
      }
    });

    res.status(201).json(newVisit);
  } catch (err) {
    console.error('Error creating visit request:', err);
    res.status(500).json({ error: 'Internal server error while registering visit.' });
  }
});

// GET route to fetch pending visits for the security clearance portal
app.get('/api/security/pending', async (req, res) => {
  try {
    const pendingVisits = await prisma.visitRequest.findMany({
      where: { status: 'PENDING' },
      include: { host: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(pendingVisits);
  } catch (err) {
    console.error('Error fetching pending visits:', err);
    res.status(500).json({ error: 'Internal server error while fetching visits.' });
  }
});

// PATCH route to update visit status (APPROVED / DENIED)
app.patch('/api/security/visits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedVisit = await prisma.visitRequest.update({
      where: { id },
      data: { status }
    });

    res.json(updatedVisit);
  } catch (err) {
    console.error('Error updating visit status:', err);
    res.status(500).json({ error: 'Internal server error while updating status.' });
  }
});

// GET route to fetch hosts/employees list
app.get('/api/hosts', async (req, res) => {
  try {
    const hosts = await prisma.user.findMany({
      select: { id: true, name: true, department: true }
    });
    res.json(hosts);
  } catch (err) {
    console.error('Error fetching hosts:', err);
    res.status(500).json({ error: 'Internal server error while fetching hosts.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});