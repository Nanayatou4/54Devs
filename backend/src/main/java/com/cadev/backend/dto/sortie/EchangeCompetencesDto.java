package com.cadev.backend.dto.sortie;

import java.util.List;

public record EchangeCompetencesDto(DeveloppeurResumeDto developpeur,
                                    List<String> ilPeutMEnseigner, List<String> jePeuxLuiEnseigner) {
}
