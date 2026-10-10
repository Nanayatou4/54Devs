package com.cadev.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GestionnaireErreurs {

    @ExceptionHandler(EmailDejaUtiliseException.class)
    ResponseEntity<Map<String, String>> emailDejaUtilise() {
        return ResponseEntity.status(409).body(Map.of("message", "Cet email est déjà utilisé"));
    }

    @ExceptionHandler(AuthenticationException.class)
    ResponseEntity<Map<String, String>> identifiantsInvalides() {
        return ResponseEntity.status(401).body(Map.of("message", "Email ou mot de passe incorrect"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, String>> validation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + " : " + f.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(Map.of("message", msg));
    }

    @ExceptionHandler(RessourceIntrouvableException.class)
    ResponseEntity<Map<String, String>> introuvable(RessourceIntrouvableException ex) {
        return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(RequeteInvalideException.class)
    ResponseEntity<Map<String, String>> requeteInvalide(RequeteInvalideException ex) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<Map<String, String>> corpsIllisible() {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Corps de requête invalide (vérifiez le JSON et les valeurs des énumérations)"));
    }

    @ExceptionHandler(ActionInterditeException.class)
    ResponseEntity<Map<String, String>> interdit(ActionInterditeException ex) {
        return ResponseEntity.status(403).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(ConflitException.class)
    ResponseEntity<Map<String, String>> conflit(ConflitException ex) {
        return ResponseEntity.status(409).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    ResponseEntity<Map<String, String>> parametreInvalide(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Valeur invalide pour le paramètre « " + ex.getName() + " »"));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<Map<String, String>> conflitDonnees() {
        return ResponseEntity.status(409)
                .body(Map.of("message", "L'opération n'a pas pu être enregistrée à cause d'un conflit. Veuillez réessayer."));
    }
}
