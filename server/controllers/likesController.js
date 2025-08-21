const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const Like = require("../models/Like");

// Add or update a like
exports.addLike = asyncErrorHandler(async (req, res, next) => {
  const { propertyId, userAddress, liked } = req.body;

  if (!propertyId || !userAddress) {
    return next(new ErrorHandler("Property ID and user address are required", 400));
  }

  try {
    // Check if like already exists
    const existingLike = await Like.findOne({ propertyId, userAddress });

    if (existingLike) {
      // Update existing like
      existingLike.liked = liked;
      existingLike.updatedAt = new Date();
      await existingLike.save();
      
      res.status(200).json({
        success: true,
        message: "Like updated successfully",
        like: existingLike
      });
    } else {
      // Create new like
      const newLike = await Like.create({
        propertyId,
        userAddress,
        liked,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.status(201).json({
        success: true,
        message: "Like added successfully",
        like: newLike
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all likes for a specific user
exports.getUserLikes = asyncErrorHandler(async (req, res, next) => {
  const { userAddress } = req.params;

  if (!userAddress) {
    return next(new ErrorHandler("User address is required", 400));
  }

  try {
    const likes = await Like.find({ userAddress, liked: true });
    
    res.status(200).json({
      success: true,
      count: likes.length,
      likes
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all likes for a specific property
exports.getPropertyLikes = asyncErrorHandler(async (req, res, next) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    return next(new ErrorHandler("Property ID is required", 400));
  }

  try {
    const likes = await Like.find({ propertyId, liked: true });
    const likesCount = likes.length;
    
    res.status(200).json({
      success: true,
      propertyId,
      likesCount,
      likes
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all likes (for admin dashboard)
exports.getAllLikes = asyncErrorHandler(async (req, res, next) => {
  try {
    const likes = await Like.find({ liked: true }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: likes.length,
      likes
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get likes statistics
exports.getLikesStats = asyncErrorHandler(async (req, res, next) => {
  try {
    const totalLikes = await Like.countDocuments({ liked: true });
    const uniqueUsers = await Like.distinct("userAddress", { liked: true });
    const uniqueProperties = await Like.distinct("propertyId", { liked: true });
    
    // Get top liked properties
    const topProperties = await Like.aggregate([
      { $match: { liked: true } },
      { $group: { _id: "$propertyId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get recent likes
    const recentLikes = await Like.find({ liked: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalLikes,
        uniqueUsers: uniqueUsers.length,
        uniqueProperties: uniqueProperties.length,
        topProperties,
        recentLikes
      }
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Remove a like
exports.removeLike = asyncErrorHandler(async (req, res, next) => {
  const { likeId } = req.params;

  if (!likeId) {
    return next(new ErrorHandler("Like ID is required", 400));
  }

  try {
    const like = await Like.findById(likeId);
    
    if (!like) {
      return next(new ErrorHandler("Like not found", 404));
    }

    await like.deleteOne();

    res.status(200).json({
      success: true,
      message: "Like removed successfully"
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
