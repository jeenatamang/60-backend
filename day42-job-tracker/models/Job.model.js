import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name must be under 100 characters']
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role must be under 100 characters']
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote'
    },
    jobType: {
      type: String,
      enum: {
        values: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
        message: 'Job type must be full-time, part-time, internship, contract, or freelance'
      },
      default: 'full-time'
    },
    status: {
      type: String,
      enum: {
        values: ['applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'],
        message: 'Status must be applied, screening, interview, offer, rejected, or withdrawn'
      },
      default: 'applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    salary: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: 'USD' }
    },
    jobUrl: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes must be under 2000 characters']
    },
    interviewDate: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high'
      },
      default: 'medium'
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

jobSchema.virtual('daysSinceApplied').get(function () {
  const now = new Date();
  const applied = new Date(this.appliedAt);
  return Math.floor((now - applied) / (1000 * 60 * 60 * 24));
});

jobSchema.virtual('salaryRange').get(function () {
  if (!this.salary.min && !this.salary.max) return 'Not specified';
  if (this.salary.min && this.salary.max) {
    return `${this.salary.currency} ${this.salary.min.toLocaleString()} - ${this.salary.max.toLocaleString()}`;
  }
  return `${this.salary.currency} ${(this.salary.min || this.salary.max).toLocaleString()}`;
});

jobSchema.virtual('isActive').get(function () {
  return !['rejected', 'withdrawn'].includes(this.status);
});

jobSchema.methods.updateStatus = async function (newStatus) {
  this.status = newStatus;
  if (newStatus === 'interview' && !this.interviewDate) {
    this.interviewDate = new Date();
  }
  return await this.save();
};

jobSchema.methods.addNote = async function (note) {
  this.notes = note;
  return await this.save();
};

jobSchema.statics.getActive = function () {
  return this.find({
    status: { $nin: ['rejected', 'withdrawn'] }
  }).sort({ appliedAt: -1 });
};

jobSchema.statics.getByStatus = function (status) {
  return this.find({ status }).sort({ appliedAt: -1 });
};

jobSchema.statics.getHighPriority = function () {
  return this.find({
    priority: 'high',
    status: { $nin: ['rejected', 'withdrawn'] }
  }).sort({ appliedAt: -1 });
};

jobSchema.pre('save', function () {
  if (this.isModified('status') && this.status === 'offer') {
    console.log(`Offer received from ${this.company} for ${this.role}!`);
  }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
