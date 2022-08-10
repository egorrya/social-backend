import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.model.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      username: req.body.username,
      avatarUrl: req.body.avatarUrl,

      email: req.body.email,
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

    UserModel.findOne(
      {
        _id: userId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Unable to get user',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'User not found',
          });
        }

        const { passwordHash, ...userData } = doc._doc;

        res.json({
          status: 'success',
          data: userData,
        });
      }
    );
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
