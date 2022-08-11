import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.model.js';

export const register = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const isEmailExist = await UserModel.find({ email });
    const isUsernameExist = await UserModel.find({ username });

    if (isEmailExist && Object.keys(isEmailExist).length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already taken',
      });
    }

    if (isUsernameExist && Object.keys(isUsernameExist).length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Username already taken',
      });
    }

    const doc = new UserModel({
      fullName: req.body.fullName,
      username,
      avatarUrl: req.body.avatarUrl,

      email,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ status: 'success', data: { ...userData, token } });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Unable to register',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({
        status: 'error',
        message: 'Wrong login or password',
      });

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass)
      return res.status(400).json({
        status: 'error',
        message: 'Wrong login or password',
      });

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ status: 'success', data: { ...userData, token } });
  } catch (error) {
    res.status(500).json({
      status: 'error',

      message: 'Unable to register',
    });
  }
};

export const changeProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const userInitialData = await UserModel.findById(userId);
    const username = req.body.username || userInitialData.username;
    const fullName = req.body.fullName || userInitialData.fullName;
    const avatarUrl = req.body.avatarUrl || userInitialData.avatarUrl;
    const backgroundUrl =
      req.body.backgroundUrl || userInitialData.backgroundUrl;
    const email = req.body.email || userInitialData.email;

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = password ? await bcrypt.hash(password, salt) : password;

    const isEmailExist = await UserModel.find({ email });
    const isUsernameExist = await UserModel.find({ username });

    if (
      req.body.email &&
      isEmailExist &&
      Object.keys(isEmailExist).length > 0
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already taken',
      });
    }

    if (
      req.body.username &&
      isUsernameExist &&
      Object.keys(isUsernameExist).length > 0
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Username already taken',
      });
    }

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        fullName,
        username,
        avatarUrl,
        backgroundUrl,
        email,
        passwordHash: hash,
      }
    );

    const user = await UserModel.findById(userId).select('-passwordHash');

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );

    res.json({ status: 'success', data: { ...user._doc, token } });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Profile did not change',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({
      status: 'success',
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'No access',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const limit = req.body.limit || 20;
    const page = req.body.page || 1;

    const users = await UserModel.find()
      .select('-passwordHash')
      .limit(limit)
      .skip(limit * (page - 1))
      .exec();

    const count = await UserModel.find().count();
    const lastPage = Math.ceil(count / limit);

    res.json({
      status: 'success',

      count: users.length,
      limit,
      page,
      last_page: lastPage,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId).select('-passwordHash');

    await res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
