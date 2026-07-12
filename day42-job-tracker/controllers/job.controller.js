import Job from '../models/Job.model.js';
import AppError from '../utils/AppError.js';

export const getAll = async (req, res, next) => {
  try {
    const { status, priority, jobType, search, sort } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (jobType) filter.jobType = jobType;
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { appliedAt: -1 };
    if (sort === 'company') sortOption = { company: 1 };
    if (sort === 'oldest') sortOption = { appliedAt: 1 };
    if (sort === 'priority') sortOption = { priority: -1 };

    const jobs = await Job.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      message: 'Jobs fetched successfully',
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw new AppError('Job application not found', 404);
    res.status(200).json({
      success: true,
      message: 'Job fetched successfully',
      data: job
    });
  } catch (err) {
    next(err);
  }
};

export const getActive = async (req, res, next) => {
  try {
    const jobs = await Job.getActive();
    res.status(200).json({
      success: true,
      message: 'Active applications fetched',
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
};

export const getHighPriority = async (req, res, next) => {
  try {
    const jobs = await Job.getHighPriority();
    res.status(200).json({
      success: true,
      message: 'High priority applications fetched',
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Job application added successfully',
      data: job
    });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) throw new AppError('Job application not found', 404);
    res.status(200).json({
      success: true,
      message: 'Job application updated successfully',
      data: job
    });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) throw new AppError('Status is required', 400);

    const job = await Job.findById(req.params.id);
    if (!job) throw new AppError('Job application not found', 404);

    await job.updateStatus(status);

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: job
    });
  } catch (err) {
    next(err);
  }
};

export const addNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note) throw new AppError('Note text is required', 400);

    const job = await Job.findById(req.params.id);
    if (!job) throw new AppError('Job application not found', 404);

    await job.addNote(note);

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: job
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) throw new AppError('Job application not found', 404);
    res.status(200).json({
      success: true,
      message: 'Job application deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const stats = async (req, res, next) => {
  try {
    const overview = await Job.aggregate([
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          activeApplications: {
            $sum: {
              $cond: [{ $not: [{ $in: ['$status', ['rejected', 'withdrawn']] }] }, 1, 0]
            }
          },
          offers: {
            $sum: { $cond: [{ $eq: ['$status', 'offer'] }, 1, 0] }
          },
          rejections: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      }
    ]);

    const byStatus = await Job.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byJobType = await Job.aggregate([
      { $group: { _id: '$jobType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byPriority = await Job.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const recentApplications = await Job.find()
      .sort({ appliedAt: -1 })
      .limit(5)
      .select('company role status appliedAt priority');

    res.status(200).json({
      success: true,
      message: 'Stats fetched successfully',
      data: {
        overview: overview[0],
        byStatus,
        byJobType,
        byPriority,
        recentApplications
      }
    });
  } catch (err) {
    next(err);
  }
};
