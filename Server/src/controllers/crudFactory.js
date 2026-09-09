import { asyncHandler } from "../middleware/asyncHandler.js";

// Generic CRUD controller factory for simple admin-managed content models.
export function crudFactory(Model, { populate, searchFields = [], defaultSort = { createdAt: -1 } } = {}) {
  return {
    list: asyncHandler(async (req, res) => {
      const filter = {};
      if (req.query.search && searchFields.length) {
        filter.$or = searchFields.map((f) => ({ [f]: { $regex: req.query.search, $options: "i" } }));
      }
      let q = Model.find(filter).sort(defaultSort);
      if (populate) q = q.populate(populate);
      const items = await q;
      res.json(items);
    }),
    get: asyncHandler(async (req, res) => {
      let q = Model.findById(req.params.id);
      if (populate) q = q.populate(populate);
      const item = await q;
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json(item);
    }),
    create: asyncHandler(async (req, res) => {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    }),
    update: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json(item);
    }),
    remove: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted" });
    }),
  };
}
