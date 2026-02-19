import Revenu from '../models/Revenu.js';
import Depense from '../models/Depense.js';
import ListeCourse from '../models/ListeCourse.js';
import catchAsync from '../utils/catchAsync.js';

export const getBudgetSummary = catchAsync(async (req, res) => {
  const mois = parseInt(req.query.mois, 10) || new Date().getMonth() + 1;
  const annee = parseInt(req.query.annee, 10) || new Date().getFullYear();

  const [revenus, depenses, listeCourse] = await Promise.all([
    Revenu.find({ mois, annee, user: req.user.id }),
    Depense.find({ mois, annee, user: req.user.id }),
    ListeCourse.findOne().sort({ dateGeneration: -1 }), // Note: ListeCourse might need user too?
  ]);

  const totalRevenus = revenus.reduce((s, r) => s + r.montant, 0);
  const totalDepenses = depenses.reduce((s, d) => s + d.montant, 0);
  const resteAVivre = totalRevenus - totalDepenses;
  const totalListeCourses =
    listeCourse?.totalEstime ?? listeCourse?.items?.reduce((s, i) => s + (i.prix || 0), 0) ?? 0;
  const resteApresCourses = totalListeCourses ? resteAVivre - totalListeCourses : null;

  res.status(200).json({
    mois,
    annee,
    totalRevenus,
    totalDepenses,
    resteAVivre,
    totalListeCourses: totalListeCourses || 0,
    resteApresCourses,
  });
});
