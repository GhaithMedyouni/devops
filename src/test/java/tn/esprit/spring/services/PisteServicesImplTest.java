package tn.esprit.spring.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import tn.esprit.spring.entities.Piste;
import tn.esprit.spring.repositories.IPisteRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

class PisteServicesImplTest {

    @Mock
    private IPisteRepository pisteRepository;

    @InjectMocks
    private PisteServicesImpl pisteServices;

    private Piste piste;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
        piste = new Piste(); // Create a Piste object for testing
        piste.setNumPiste(1L); // Set ID or other properties as needed
        // Set any other properties of the Piste object if required
    }

    @Test
    void testRetrieveAllPistes() {
        // Arrange
        List<Piste> pistes = new ArrayList<>();
        pistes.add(piste);
        when(pisteRepository.findAll()).thenReturn(pistes); // Mock repository behavior

        // Act
        List<Piste> result = pisteServices.retrieveAllPistes();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(piste, result.get(0));
    }

    @Test
    void testAddPiste() {
        // Arrange
        when(pisteRepository.save(piste)).thenReturn(piste); // Mock save behavior

        // Act
        Piste result = pisteServices.addPiste(piste);

        // Assert
        assertNotNull(result);
        assertEquals(piste, result);
    }

    @Test
    void testRemovePiste() {
        // Act
        pisteServices.removePiste(piste.getNumPiste());

        // Assert
        verify(pisteRepository, times(1)).deleteById(piste.getNumPiste()); // Verify that deleteById was called
    }

    @Test
    void testRetrievePiste() {
        // Arrange
        when(pisteRepository.findById(piste.getNumPiste())).thenReturn(Optional.of(piste)); // Mock find behavior

        // Act
        Piste result = pisteServices.retrievePiste(piste.getNumPiste());

        // Assert
        assertNotNull(result);
        assertEquals(piste, result);
    }

    @Test
    void testRetrievePisteNotFound() {
        // Arrange
        when(pisteRepository.findById(anyLong())).thenReturn(Optional.empty()); // Mock not found

        // Act
        Piste result = pisteServices.retrievePiste(999L); // Use a non-existing ID

        // Assert
        assertNull(result); // Expect null for non-existing piste
    }
}
