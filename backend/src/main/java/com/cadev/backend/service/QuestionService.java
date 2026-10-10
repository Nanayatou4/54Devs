package com.cadev.backend.service;

import com.cadev.backend.dto.entree.QuestionRequete;
import com.cadev.backend.dto.entree.ReponseRequete;
import com.cadev.backend.dto.sortie.*;
import com.cadev.backend.entite.Question;
import com.cadev.backend.entite.Reponse;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.exception.ActionInterditeException;
import com.cadev.backend.exception.RequeteInvalideException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.QuestionRepository;
import com.cadev.backend.repository.ReponseRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.service.specifications.QuestionSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private static final int TAILLE_MAX = 50;

    private final QuestionRepository questions;
    private final ReponseRepository reponses;
    private final UtilisateurRepository utilisateurs;

    @Transactional
    public QuestionDetailDto creer(String email, QuestionRequete req) {
        Utilisateur moi = trouverUtilisateur(email);
        Question q = new Question();
        q.setAuteur(moi);
        appliquer(q, req);
        questions.save(q);
        return construireDetail(q, moi);
    }

    @Transactional(readOnly = true)
    public PageDto<QuestionResumeDto> rechercher(String texte, String categorie, Boolean resolue,
                                                 String tri, int page, int taille) {
        Sort ordre;
        if (tri == null || tri.equalsIgnoreCase("recentes")) {
            ordre = Sort.by(Sort.Order.desc("dateCreation"));
        } else if (tri.equalsIgnoreCase("populaires")) {
            ordre = Sort.by(Sort.Order.desc("nombreReponses"), Sort.Order.desc("dateCreation"));
        } else {
            throw new RequeteInvalideException("Le tri doit être « recentes » ou « populaires »");
        }

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(taille, 1), TAILLE_MAX), ordre);
        Page<Question> resultat = questions.findAll(QuestionSpecifications.filtres(texte, categorie, resolue), pageable);

        List<QuestionResumeDto> contenu = resultat.getContent().stream().map(q -> new QuestionResumeDto(
                q.getId(), q.getTitre(), extrait(q.getContenu()), q.getCategorie(),
                q.getNombreReponses(), q.isResolue(), q.getDateCreation(),
                UtilisateurResumeDto.depuis(q.getAuteur()))).toList();
        return PageDto.depuis(resultat, contenu);
    }

    @Transactional(readOnly = true)
    public List<String> categories() {
        return questions.categories();
    }

    @Transactional(readOnly = true)
    public QuestionDetailDto detail(Long id, String email) {
        return construireDetail(trouverQuestion(id), trouverUtilisateur(email));
    }

    @Transactional
    public QuestionDetailDto modifier(Long id, String email, QuestionRequete req) {
        Question q = trouverQuestion(id);
        Utilisateur moi = trouverUtilisateur(email);
        if (!q.getAuteur().getId().equals(moi.getId())) {
            throw new ActionInterditeException("Seul l'auteur peut modifier sa question");
        }
        appliquer(q, req);
        return construireDetail(q, moi);
    }

    @Transactional
    public ReponseDto repondre(Long questionId, String email, ReponseRequete req) {
        Question q = trouverQuestion(questionId);
        Utilisateur moi = trouverUtilisateur(email);

        Reponse r = new Reponse();
        r.setQuestion(q);
        r.setAuteur(moi);
        r.setContenu(req.contenu().trim());
        reponses.save(r);
        questions.incrementerReponses(questionId);
        return ReponseDto.depuis(r);
    }

    @Transactional
    public ReponseDto modifierReponse(Long questionId, Long reponseId, String email, ReponseRequete req) {
        Reponse r = trouverReponse(questionId, reponseId);
        Utilisateur moi = trouverUtilisateur(email);
        if (!r.getAuteur().getId().equals(moi.getId())) {
            throw new ActionInterditeException("Seul l'auteur peut modifier sa réponse");
        }
        r.setContenu(req.contenu().trim());
        return ReponseDto.depuis(r);
    }

    @Transactional
    public ReponseDto marquerSolution(Long questionId, Long reponseId, String email) {
        Question q = trouverQuestion(questionId);
        Utilisateur moi = trouverUtilisateur(email);
        if (!q.getAuteur().getId().equals(moi.getId())) {
            throw new ActionInterditeException("Seul l'auteur de la question peut choisir la solution");
        }
        Reponse r = trouverReponse(questionId, reponseId);

        // Une seule solution par question : on retire l'ancienne
        reponses.findByQuestionIdAndSolutionTrue(questionId).forEach(ancienne -> ancienne.setSolution(false));
        r.setSolution(true);
        q.setResolue(true);
        return ReponseDto.depuis(r);
    }

    // ---------- Méthodes privées ----------

    private void appliquer(Question q, QuestionRequete req) {
        q.setTitre(req.titre().trim());
        q.setContenu(req.contenu().trim());
        q.setCategorie(req.categorie() == null || req.categorie().isBlank() ? null : req.categorie().trim());
    }

    private QuestionDetailDto construireDetail(Question q, Utilisateur moi) {
        List<ReponseDto> liste = reponses.findPourQuestion(q.getId()).stream().map(ReponseDto::depuis).toList();
        return new QuestionDetailDto(q.getId(), q.getTitre(), q.getContenu(), q.getCategorie(),
                q.getDateCreation(), q.isResolue(), q.getNombreReponses(),
                UtilisateurResumeDto.depuis(q.getAuteur()),
                q.getAuteur().getId().equals(moi.getId()), liste);
    }

    private static String extrait(String contenu) {
        return contenu.length() > 200 ? contenu.substring(0, 200) + "…" : contenu;
    }

    private Question trouverQuestion(Long id) {
        return questions.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Question introuvable"));
    }

    private Reponse trouverReponse(Long questionId, Long reponseId) {
        return reponses.findById(reponseId)
                .filter(r -> r.getQuestion().getId().equals(questionId))
                .orElseThrow(() -> new RessourceIntrouvableException("Réponse introuvable"));
    }

    private Utilisateur trouverUtilisateur(String email) {
        return utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
    }
}