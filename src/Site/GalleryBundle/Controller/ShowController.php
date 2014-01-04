<?php

namespace Site\GalleryBundle\Controller;
use Site\GalleryBundle\Controller\DefaultController;

use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use Site\GalleryBundle\Entity\ImageCategory;


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Doctrine\Common\Collections\ArrayCollection;

class ShowController extends DefaultController {
	
	const REDIRECT_CODE = 301;

	/**
	 * Главная страница галереи
	 * Возвращает список категорий галереи
	 *
	 * @Template()
	 */
	public function indexAction() {
		// === Редирект ===
		/*
		 * Список примеров URL страниц старой галереи
		 * http://images.nfsko.ru/index.php?page=gallery&cat=17
		 * http://images.nfsko.ru/index.php?page=gallery&view=160
		 * http://images.nfsko.ru/index.php?page=gallery&user=22753
		 * http://images.nfsko.ru/index.php?page=gallery&view=my_files
		 */
		$query = $this->getRequest()->query;
		$logger = $this->get('gallery_redirect_logger');
		if ( $query->has('cat') ) {			
			$id = $query->get('cat');		
			try {				
				$category = $this->getCategory($id);
				$logger->info( sprintf('Редирект %d с %s в категорию "%s" - для %s', self::REDIRECT_CODE, $this->getRequest()->getQueryString(), $category->getRefId(), $this->getRequest()->headers->get('User-Agent') ) );
				return $this->redirect( $this->generateUrl( 'site_gallery_category', array('cRefId' => $category->getRefId()) ), self::REDIRECT_CODE );
			} catch (\Doctrine\Orm\NoResultException $e) {
				$logger->info( sprintf('Ошибка редиректа с %s', $this->getRequest()->getQueryString() ) );
				throw $this->createNotFoundException(sprintf('Категория %s не существует',$id));
			}			
		}		
		if ( $query->has('view') ) {
			$id = $query->get('view');
			$repository = $this->getDoctrine()->getManager()->getRepository('SiteGalleryBundle:ImageAlbum');
			try {
				$album = $repository->getAlbumById($id);
				$logger->info( sprintf('Редирект %d с %s в альбом "%s" в категории "%s" - для %s', self::REDIRECT_CODE, $this->getRequest()->getQueryString(), $album->getDictionary()->getRefId(), $album->getCategory()->getRefId(), $this->getRequest()->headers->get('User-Agent') ) );
				return $this->redirect($this->generateUrl( 'site_gallery_album', array('cRefId' => $album->getCategory()->getRefId(), 'aRefId' => $album->getDictionary()->getRefId() ), self::REDIRECT_CODE ));				
			} catch (\Doctrine\Orm\NoResultException $e) {
				throw $this->createNotFoundException(sprintf('Альбома %s не существует',$id));		
			}
		}
		// === Редирект (конец) ===	
					
		try {
			$this->action = __FUNCTION__;
			$this->initVars();
			$this->getCategoryList( true );
			$this->body['categoryList'] = $this->categoryList;
			$this->body['imageHostName'] = $this->imageHostName;
		} catch (\Exception $e) {
			$this->error[] = $e->getMessage();
			if ( $this->getUser()->isMod() )
				$this->error['trace'] = $e->getTraceAsString();
		}	
		return $this->createResponse();
	}

	/**
	 * Возвращает категорию и список альбомов в ней
	 * @param string $cRefId
	 * @return multitype:unknown \Symfony\Component\DependencyInjection\mixed
	 * 
	 * @Template()
	 */
	public function showCategoryAction($cRefId) {
		try {
			$this->action = __FUNCTION__;
			$this->initVars();
			$this->getCategoryList( false );		
			$this->body['categoryList'] = $this->categoryList;
			$this->getCategory($cRefId, true, true);
			$this->body['category'] = $this->category;
			$this->body['imageHostName'] = $this->imageHostName;
		//} catch (\NoResultException $e) {
		//	throw $this->createNotFoundException(sprintf('Категория %s не существует',$cRefId));
		} catch (\Exception $e) {
			$this->error[] = $e->getMessage();
			if ( $this->getUser()->isMod() )
				$this->error['trace'] = $e->getTraceAsString();
		}
		return $this->createResponse();
	}

	/**
	 * Возвращает альбом и изображения в нём
	 * @param string $cRefId
	 * @param string $aRefId
	 * @return multitype:NULL unknown \Symfony\Component\DependencyInjection\mixed
	 * 
	 * @Template()
	 */
	public function showAlbumAction($cRefId, $aRefId) {
		try {
			$this->action = __FUNCTION__;
			$this->initVars();
			$this->getCategoryList( false );			
			$this->body['categoryList'] = $this->categoryList;
			$this->getAlbum($cRefId, $aRefId, true);
			$this->body['album'] = $this->album;
			$this->body['imageHostName'] = $this->imageHostName;
		//} catch (\NoResultException $e) {
		//	throw $this->createNotFoundException(sprintf('Категория %s не существует',$cRefId));
		} catch (\Exception $e) {
			$this->error[] = $e->getMessage();
			if ( $this->getUser()->isMod() )
				$this->error['trace'] = $e->getTraceAsString();
		}
		return $this->createResponse();
	}
	
	/**
	 * Возвращает изображение
	 * @param unknown $iId
	 * @throws AccessDeniedHttpException
	 * @throws \Exception
	 * @return \Site\GalleryBundle\Controller\Response
	 * 
	 * @Template()
	 */
	public function showImageAction($iId) {
		//if ( !$this->getRequest()->isXmlHttpRequest() )
		//	throw new AccessDeniedHttpException();
		try {
			$this->action = __FUNCTION__;
			$this->initVars();
			$this->getCategoryList( false );
			$this->body['categoryList'] = $this->categoryList;
			$this->getImage($iId, false, false);
			$this->body['image'] = $this->image;
			$this->body['imageHostName'] = $this->imageHostName;
		} catch (\Exception $e) {
			$this->error[] = $e->getMessage();
			if ( $this->getUser()->isMod() )
				$this->error['trace'] = $e->getTraceAsString();
		}
		return $this->createResponse();
	}

// 	/**
// 	 * пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅ пїЅпїЅпїЅ
// 	 * @param integer $id пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ
// 	 *
// 	 *	@Template()
// 	 */
// 	public function showHistoryAction() {
// 		$this->imageHostName = $this->container->getParameter('img_host');
// 		$em = $this->getDoctrine()->getManager();
// 		$images = $em->getRepository('SiteGalleryBundle:Image')
// 				->getMonthHistory();
// 		return array('images' => $images, 'imgHostName' => $this->imageHostName);

// 	}
}
