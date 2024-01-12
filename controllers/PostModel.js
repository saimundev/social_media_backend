import PostModel from "../models/post.js";
import UserModel from "../models/user.js";
import cloudinaryModul from "../utils/coludinary.js";

//crate post
export const createPost = async (req, res) => {
  const { postText } = req.body;
  const { id } = req.user;
  try {
    if (req.file) {
      //image send coludinary
      const uploadRes = await cloudinaryModul.uploader.upload(req.file.path, {
        upload_preset: "social_media_online",
        transformation: [
          {
            width: 800,
            height: 400,
          },
        ],
      });

      if (uploadRes) {
        await PostModel.create({
          postText,
          postImage: uploadRes,
          userId: id,
          postBy: id,
        });
      }
    } else {
      await PostModel.create({
        postText,
        userId: id,
        postBy: id,
      });
    }
    res.status(201).json({ message: "Post create successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get post by id
export const getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await PostModel.findById({ _id: postId });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get post by user
export const getPostByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const post = await PostModel.find({ userId })
      .populate("comments.commentBy", "name  profile.secure_url -_id")
      .populate("postBy", "name  profile.secure_url -_id")
      .populate("likes.likeBy", "name profile.secure_url")
      .sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//update post
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  console.log(req.file);
  try {
    if (req.file !== undefined) {
      const user = await PostModel.findById({ _id: postId });

      if (user.postImage) {
        await cloudinaryModul.uploader.destroy(user.postImage.public_id);
      }

      const uploadRes = await cloudinaryModul.uploader.upload(req.file.path, {
        upload_preset: "social_media_online",
        transformation: [
          {
            width: 800,
            height: 400,
          },
        ],
      });

      if (uploadRes) {
        await PostModel.findByIdAndUpdate(
          { _id: postId },
          {
            postText: req.body.postText,
            postImage: uploadRes,
          },
          { new: true }
        );
      }
    } else {
      await PostModel.findOneAndUpdate(
        { _id: postId },
        { postText: req.body.postText },
        { new: true }
      );
    }

    res.status(200).json({ message: "Post update successful" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//delete post
export const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    //delete post
    await PostModel.findByIdAndDelete({ _id: postId }, { new: true });

    res.status(200).json({ message: "Post delete successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//like the post
export const likePost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    //find post by id
    const post = await PostModel.findById({ _id: postId });

    const userLike = {
      likeBy: userId,
      like: userId,
    };

    if (!post.likes.find((like) => like.like.includes(userId))) {
      await post.updateOne({ $push: { likes: userLike } });
      res.status(200).json({ message: "Like has been successful" });
    } else {
      await post.updateOne({ $pull: { likes: userLike } });
      res.status(200).json({ message: "unLike has been successful" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//comment the post
export const commentPost = async (req, res) => {
  const { comment, commentBy, postId } = req.body;
  try {
    const userComment = {
      comment,
      commentBy,
      createdAt: Date.now(),
    };
    await PostModel.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: userComment } },
      { new: true }
    );

    res.status(201).json({ message: "Comment han been created" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get timeline post
export const getTimeLinePost = async (req, res) => {
  const { userId } = req.params;
  try {
    const currentUser = await UserModel.findById({ _id: userId });
    const currentUSerPost = await PostModel.find({
      userId: currentUser._id,
    })
      .populate("postBy", "name  profile.secure_url _id")
      .populate("comments.commentBy", "name  profile.secure_url _id")
      .populate("likes.likeBy", "name profile.secure_url");

    //find friend post
    const friendPost = await Promise.all(
      currentUser.friends.map((friendId) =>
        PostModel.find({ userId: friendId })
          .populate("postBy", "name  profile.secure_url _id")
          .populate("comments.commentBy", "name  profile.secure_url _id")
          .populate("likes.likeBy", "name profile.secure_url")
      )
    );

    //time line post
    const timeLinePost = currentUSerPost
      .concat(...friendPost)
      .sort((a, b) => b.createdAt - a.createdAt);

    //find user all post
    const countUserPost = await PostModel.find({ userId }).countDocuments();

    res.status(200).json({ timeLinePost, countUserPost });
  } catch (error) {
    res.status(500).json({ message: "Server Error. Try again later" });
  }
};

//get video data
export const getVideoData = async (req, res) => {
  const data = [
    {
      id: "1",
      title: "Big Buck Bunny",
      thumbnailUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/1200px-Big_Buck_Bunny_thumbnail_vlc.png",
      duration: "8:18",
      uploadTime: "May 9, 2011",
      views: "24,969,123",
      author: "Vlc Media Player",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      description:
        "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
      subscriber: "25254545 Subscribers",
      isLive: true,
    },
    {
      id: "2",
      title: "The first Blender Open Movie from 2006",
      thumbnailUrl:
        "https://i.ytimg.com/vi_webp/gWw23EYM9VM/maxresdefault.webp",
      duration: "12:18",
      uploadTime: "May 9, 2011",
      views: "24,969,123",
      author: "Blender Inc.",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      description:
        "Song : Raja Raja Kareja Mein Samaja\nAlbum : Raja Kareja Mein Samaja\nArtist : Radhe Shyam Rasia\nSinger : Radhe Shyam Rasia\nMusic Director : Sohan Lal, Dinesh Kumar\nLyricist : Vinay Bihari, Shailesh Sagar, Parmeshwar Premi\nMusic Label : T-Series",
      subscriber: "25254545 Subscribers",
      isLive: true,
    },
    {
      id: "3",
      title: "For Bigger Blazes",
      thumbnailUrl: "https://i.ytimg.com/vi/Dr9C2oswZfA/maxresdefault.jpg",
      duration: "8:18",
      uploadTime: "May 9, 2011",
      views: "24,969,123",
      author: "T-Series Regional",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description:
        "Song : Raja Raja Kareja Mein Samaja\nAlbum : Raja Kareja Mein Samaja\nArtist : Radhe Shyam Rasia\nSinger : Radhe Shyam Rasia\nMusic Director : Sohan Lal, Dinesh Kumar\nLyricist : Vinay Bihari, Shailesh Sagar, Parmeshwar Premi\nMusic Label : T-Series",
      subscriber: "25254545 Subscribers",
      isLive: true,
    },
    {
      id: "4",
      title: "For Bigger Escape",
      thumbnailUrl:
        "https://img.jakpost.net/c/2019/09/03/2019_09_03_78912_1567484272._large.jpg",
      duration: "8:18",
      uploadTime: "May 9, 2011",
      views: "24,969,123",
      author: "T-Series Regional",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      description:
        " Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when Batman's escapes aren't quite big enough. For $35. Learn how to use Chromecast with Google Play Movies and more at google.com/chromecast.",
      subscriber: "25254545 Subscribers",
      isLive: false,
    },
    {
      id: "5",
      title: "Big Buck Bunny",
      thumbnailUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/1200px-Big_Buck_Bunny_thumbnail_vlc.png",
      duration: "8:18",
      uploadTime: "May 9, 2011",
      views: "24,969,123",
      author: "Vlc Media Player",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      description:
        "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
      subscriber: "25254545 Subscribers",
      isLive: true,
    },
    {
      id: "6",
      title: "For Bigger Blazes",
      thumbnailUrl: "https://i.ytimg.com/vi/Dr9C2oswZfA/maxresdefault.jpg",
      duration: "8:18",
      uploadTime: "May 9, 2011",
      views: "24,969,123",
      author: "T-Series Regional",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description:
        "Song : Raja Raja Kareja Mein Samaja\nAlbum : Raja Kareja Mein Samaja\nArtist : Radhe Shyam Rasia\nSinger : Radhe Shyam Rasia\nMusic Director : Sohan Lal, Dinesh Kumar\nLyricist : Vinay Bihari, Shailesh Sagar, Parmeshwar Premi\nMusic Label : T-Series",
      subscriber: "25254545 Subscribers",
      isLive: false,
    },
    {
      id: "7",
      title: "For Bigger Escape",
      thumbnailUrl:
        "https://img.jakpost.net/c/2019/09/03/2019_09_03_78912_1567484272._large.jpg",
      duration: "8:18",
      uploadTime: "May 9, 2011",
      views: "24,969,123",
      author: "T-Series Regional",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      description:
        " Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when Batman's escapes aren't quite big enough. For $35. Learn how to use Chromecast with Google Play Movies and more at google.com/chromecast.",
      subscriber: "25254545 Subscribers",
      isLive: true,
    },
    {
      id: "8",
      title: "The first Blender Open Movie from 2006",
      thumbnailUrl:
        "https://i.ytimg.com/vi_webp/gWw23EYM9VM/maxresdefault.webp",
      duration: "12:18",
      uploadTime: "May 9, 2011",
      views: "24,969,123",
      author: "Blender Inc.",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      description:
        "Song : Raja Raja Kareja Mein Samaja\nAlbum : Raja Kareja Mein Samaja\nArtist : Radhe Shyam Rasia\nSinger : Radhe Shyam Rasia\nMusic Director : Sohan Lal, Dinesh Kumar\nLyricist : Vinay Bihari, Shailesh Sagar, Parmeshwar Premi\nMusic Label : T-Series",
      subscriber: "25254545 Subscribers",
      isLive: false,
    },
  ];

  try {
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error. Try again later" });
  }
};
