const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.post("/events", eventController.createEvent);
router.get("/events", eventController.getEvents);
router.get("/events/:id", eventController.getEventById);
router.put("/events/:id", eventController.updateEvent);
router.delete("/events/:id", eventController.deleteEvent);

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({ status: "Event service running" });
});

module.exports = router;