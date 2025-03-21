import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all comments for a post
 */
async function getPostComments(req, res) {
  try {
    const { postId } = req.params;  // Changed from req.body to req.params

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentCommentId: null // Only get top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Internal error while fetching comments" });
  }
}

/**
 * Create a new comment
 */
async function createComment(req, res) {
  try {
    const { content, postId, parentCommentId } = req.body;
    const authorId = req.body.authorId;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Validate post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // If it's a reply, validate parent comment exists
    if (parentCommentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentCommentId }
      });

      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found" });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId,
        postId,
        parentCommentId: parentCommentId || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          }
        },
        replies: true
      }
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "Internal error while creating comment" });
  }
}

/**
 * Update a comment
 */
async function updateComment(req, res) {
  try {
    const { id, content } = req.body;
    const authorId = req.body.authorId;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!existingComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (existingComment.authorId !== authorId) {
      return res.status(403).json({ error: "Not authorized to update this comment" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content: content.trim()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              }
            }
          }
        }
      }
    });

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ error: "Internal error while updating comment" });
  }
}

/**
 * Delete a comment
 */
async function deleteComment(req, res) {
  try {
    const { id } = req.body;
    const authorId = req.body.authorId;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.authorId !== authorId) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    await prisma.comment.delete({
      where: { id }
    });

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Internal error while deleting comment" });
  }
}

export const commentController = {
  getPostComments,
  createComment,
  updateComment,
  deleteComment
};