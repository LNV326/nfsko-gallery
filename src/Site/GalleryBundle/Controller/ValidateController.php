<?php
namespace Site\GalleryBundle\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

use Site\GalleryBundle\Controller\DefaultController;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\File\File;

class ValidateController extends DefaultController {
	
	/**
	 * 
	 */
	public function validateAllAction() {
		$this->initVars();		
		$errorCategoryList = array();
		$errorAlbumList = array();
		$errorImageList = array();
		// Проверка категорий
		$this->getCategoryList( true );
		foreach ( $this->categoryList as $category ) {
			if ( is_null($category->getCoverImage()) )
				$errorCategoryList[$category->getId()][] = 'noCover';
			// Проверка альбомов категории		
			$albumList = $category->getAlbums();
			foreach ( $albumList as $album ) {
				if ( is_null($album->getCoverImage()) )
					$errorAlbumList[$album->getId()][] = 'noCover';
				// Проверка изображений
				$imageList = $album->getImages();
				foreach ( $imageList as $image ) {
					if ( !file_exists( $image->getAbsoluteThumbPath() ) )						
						$errorImageList[$image->getId()][] = 'noThumb';
					if ( !file_exists( $image->getAbsoluteThumbPath_old() ) )
						$errorImageList[$image->getId()][] = 'noThumbOld';
					if ( !file_exists( $image->getAbsolutePath() ) )
						$errorImageList[$image->getId()][] = 'noImage';
				}
			}
		}
		$this->body['errorCategoryList'] = $errorCategoryList;
		$this->body['errorAlbumList'] = $errorAlbumList;
		$this->body['errorImageList'] = $errorImageList;		
		return new JsonResponse( $this->createResponse() );
	}
}
?>